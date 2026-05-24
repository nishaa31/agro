from fastapi import FastAPI, File, UploadFile, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from contextlib import asynccontextmanager
from datetime import date, timedelta
from sqlalchemy import create_engine, Column, Integer, String
from sqlalchemy.orm import sessionmaker, declarative_base, Session
from torchvision import models, transforms
from PIL import Image
from fastapi import Form
from datetime import datetime
from fastapi.staticfiles import StaticFiles

import joblib
import json
import numpy as np
import io
import os
import torch
import torch.nn as nn
import shutil

DEVICE = "cuda" if torch.cuda.is_available() else "cpu"
os.makedirs("uploads", exist_ok=True)
# ─────────────────────────────────────────
# CONFIG
# ─────────────────────────────────────────
DISEASE_MODEL_PATH  = "ml_models/disease_model.pth"
YIELD_MODEL_PATH    = "ml_models/yield_model.pkl"
YIELD_ENCODER_PATH  = "ml_models/label_encoders.pkl"
YIELD_META_PATH     = "ml_models/model_meta.json"
TIME_SERIES_MODEL_PATH = "ml_models/time_series_model.pkl"
DATABASE_URL = "sqlite:///./agropestro.db"
DEVICE = "cuda" if torch.cuda.is_available() else "cpu"

# Globals
disease_model    = None
disease_classes  = None
disease_img_size = 224

yield_rf_model   = None
yield_encoders   = None
yield_meta       = None
time_series_model = None
#---------------------DB----------------------------------
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(bind=engine)
Base = declarative_base()

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    phone = Column(String, unique=True)
    password = Column(String)
    email = Column(String, default="")
    location = Column(String)
    profile_image = Column(String, default="")
    role = Column(String, default="farmer")

class History(Base):
    __tablename__ = "history"

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer)
    action_type = Column(String)
    result = Column(String)
    confidence = Column(String)
    date = Column(String)



def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True)
    farmer_id = Column(Integer)
    name = Column(String)
    category = Column(String)
    price = Column(Integer)
    stock = Column(Integer)
    image = Column(String)
    description = Column(String)
    

class Order(Base):
    __tablename__ = "orders"

    id = Column(Integer, primary_key=True)
    customer_id = Column(Integer)
    farmer_id = Column(Integer)
    product_id = Column(Integer)
    quantity = Column(Integer)
    total_price = Column(Integer)
    status = Column(String, default="Pending")
  

class ProductInput(BaseModel):
    farmer_id: int
    name: str
    category: str
    price: int
    stock: int
    image: str
    description: str
   

class Cart(Base):
    __tablename__ = "cart"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(Integer)
    product_id = Column(Integer)

    quantity = Column(Integer, default=1)

Base.metadata.create_all(bind=engine)

# ─────────────────────────────────────────
# LOAD MODELS
# ─────────────────────────────────────────
def load_disease_model():
    global disease_model, disease_classes, disease_img_size

    try:
        print("Loading disease model...")

        ckpt = torch.load(DISEASE_MODEL_PATH, map_location=DEVICE)

        disease_classes = ckpt["classes"]
        disease_img_size = ckpt.get("img_size", 224)

        base = models.resnet50(weights=None)
        base.fc = nn.Sequential(
            nn.Dropout(0.5),
            nn.Linear(base.fc.in_features, 512),
            nn.ReLU(),
            nn.Dropout(0.3),
            nn.Linear(512, len(disease_classes))
        )

        base.load_state_dict(ckpt["model_state_dict"])
        base.to(DEVICE).eval()

        disease_model = base

        print("✅ Disease model loaded")

    except Exception as e:
        print("❌ Disease model error:", e)


def load_yield_model():
    global yield_rf_model, yield_encoders, yield_meta

    try:
        print("Loading yield model...")

        yield_rf_model = joblib.load(YIELD_MODEL_PATH)
        yield_encoders = joblib.load(YIELD_ENCODER_PATH)

        with open(YIELD_META_PATH) as f:
            yield_meta = json.load(f)

        print("✅ Yield model loaded")

    except Exception as e:
        print("❌ Yield model error:", e)

def load_time_series_model():
    global time_series_model

    if not os.path.exists(TIME_SERIES_MODEL_PATH):
        print("❌ time series model not found")
        return

    print("✅ Loading time series model...")
    time_series_model = joblib.load(TIME_SERIES_MODEL_PATH)



@asynccontextmanager
async def lifespan(app: FastAPI):
    load_disease_model()
    load_yield_model()
    load_time_series_model()
    yield

# ───────── HELPER ─────────
def save_history(db, user_id, action, result, confidence="model"):
    history = History(
        user_id=user_id,
        action_type=action,
        result=result,
        confidence=confidence,
        date=str(datetime.now())
    )
    db.add(history)
    db.commit()
    
# ─────────────────────────────────────────
# APP INIT
# ─────────────────────────────────────────
app = FastAPI(
    title="AgroPestro API 🌾",
    version="2.0",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ─────────────────────────────────────────
# TREATMENT MAP
# ─────────────────────────────────────────
TREATMENT_MAP = {
    "stripe_rust": "Apply Tebuconazole spray immediately.",
    "leaf_rust": "Use Mancozeb fungicide.",
    "powdery_mildew": "Apply Sulphur-based fungicide.",
    "healthy": "Crop is healthy. Maintain irrigation."
}

def get_treatment(disease):
    key = disease.lower().replace(" ", "_")
    return TREATMENT_MAP.get(key, "Consult agricultural expert.")


# ─────────────────────────────────────────
# ROOT
# ─────────────────────────────────────────
@app.get("/")
def root():
    return {"status": "AgroPestro API running 🚀"}


# ─────────────────────────────────────────
# DISEASE PREDICTION (FINAL)
# ─────────────────────────────────────────
@app.post("/predict/disease")
async def predict_disease(
    user_id: int = Form(...),
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    contents = await file.read()
    image = Image.open(io.BytesIO(contents)).convert("RGB")

    transform = transforms.Compose([
        transforms.Resize((disease_img_size, disease_img_size)),
        transforms.ToTensor(),
        transforms.Normalize([0.485, 0.456, 0.406],
                             [0.229, 0.224, 0.225])
    ])

    img = transform(image).unsqueeze(0).to(DEVICE)

    with torch.no_grad():
        output = disease_model(img)
        probs = torch.softmax(output, dim=1)[0].cpu().numpy()

    top_idx = int(np.argmax(probs))
    disease = disease_classes[top_idx]
    confidence = float(probs[top_idx])

    # 🔥 SAVE HISTORY (INSIDE FUNCTION)
    save_history(db, user_id, "disease", disease, str(round(confidence, 3)))

    # 🔥 AI LOGIC
    if confidence > 0.75:
        severity = "High"
    elif confidence > 0.4:
        severity = "Medium"
    else:
        severity = "Low"

    yield_loss = int(confidence * 50)

    explanation = f"The model is {round(confidence*100,2)}% confident that the crop has {disease.replace('_',' ')}."

    all_predictions = sorted(
        [{"disease": c, "confidence": round(float(p), 3)}
         for c, p in zip(disease_classes, probs)],
        key=lambda x: -x["confidence"]
    )[:5]

    return {
    "disease": disease,
    "confidence": round(confidence, 3),
    "severity": severity,
    "yield_loss": yield_loss,
    "explanation": explanation,
    "treatment": get_treatment(disease),
    "top_predictions": all_predictions
}


# ─────────────────────────────────────────
# YIELD PREDICTION
# ─────────────────────────────────────────
class YieldInput(BaseModel):
    crop_type: str
    soil_type: str
    soil_ph: float
    temperature: float
    humidity: float
    wind_speed: float
    n: float
    p: float
    k: float
    soil_quality: float


@app.post("/predict/yield")
def predict_yield(data: YieldInput, db: Session = Depends(get_db), user_id: int = 1):

    if yield_rf_model is None:
        raise HTTPException(500, "Yield model not loaded")

    raw = {
        "Crop_Type": data.crop_type,
        "Soil_Type": data.soil_type,
        "Soil_pH": data.soil_ph,
        "Temperature": data.temperature,
        "Humidity": data.humidity,
        "Wind_Speed": data.wind_speed,
        "N": data.n,
        "P": data.p,
        "K": data.k,
        "Soil_Quality": data.soil_quality,
    }

    for col in yield_meta["categorical_cols"]:
        if col in yield_encoders:
            raw[col] = int(yield_encoders[col].transform([raw[col]])[0])

    features = np.array([[raw[f] for f in yield_meta["feature_names"]]])

    pred = float(yield_rf_model.predict(features)[0])
    save_history(db, user_id, "yield", f"{pred} tonnes/hectare")
    return {
        "predicted_yield": round(pred, 2),
        "unit": "tonnes/hectare"
    }

class TimeSeriesInput(BaseModel):
    start_date: date
    end_date: date



@app.post("/predict/timeseries")
def predict_timeseries(data: TimeSeriesInput, user_id: int, db: Session = Depends(get_db)):

    if time_series_model is None:
        raise HTTPException(500, "Time series model not loaded")

    if data.start_date > data.end_date:
        raise HTTPException(400, "Invalid date range")

    dates = []
    current = data.start_date

    while current <= data.end_date:
        dates.append(current)
        current += timedelta(days=1)

    steps = len(dates)
    preds = time_series_model.forecast(steps=steps)

    save_history(db, user_id, "timeseries", "Forecast generated")

    return {
        "dates": [str(d) for d in dates],
        "predicted_yield": [float(p) for p in preds]
    }

#----------imapct------------------
class ImpactInput(BaseModel):
    soil_type: str
    temperature: float
    humidity: float


@app.post("/predict/impact")
def predict_impact(data: ImpactInput, user_id: int, db: Session = Depends(get_db)):

    # 🔥 SIMPLE LOGIC (demo + realistic)
    impact = 0

    # temperature effect
    if data.temperature > 35:
        impact += 20
    elif data.temperature < 15:
        impact += 10

    # humidity effect
    if data.humidity > 80:
        impact += 25
    elif data.humidity < 30:
        impact += 10

    # soil effect
    if data.soil_type.lower() == "sandy":
        impact += 15
    elif data.soil_type.lower() == "loamy":
        impact += 5

    # fertilizer suggestion
    if impact > 40:
        fertilizer = "High Nitrogen Fertilizer (Urea)"
    elif impact > 20:
        fertilizer = "Balanced NPK Fertilizer"
    else:
        fertilizer = "Organic Compost Recommended"

    save_history(db, user_id, "impact", f"Loss {impact}%")

    return {
        "yield_loss": impact,
        "fertilizer": fertilizer,
        "status": "High Risk" if impact > 40 else "Moderate" if impact > 20 else "Low Risk"
    }

#---------login-----------------
class LoginInput(BaseModel):
    name: str = ""
    phone: str
    password: str
    location: str= ""
    role: str = "farmer"

@app.post("/login")
def login(data: LoginInput, db: Session = Depends(get_db)):

    user = db.query(User).filter(User.phone == data.phone).first()

    # LOGIN
    if user:

        if user.password != data.password:
            raise HTTPException(status_code=401, detail="Invalid password")

        return {
            "user_id": user.id,
            "name": user.name,
            "phone": user.phone,
            "location": user.location,
            "email": user.email,
            "profile_image": user.profile_image,
            "role": user.role,
        }

    # REGISTER
    user = User(
        name=data.name,
        phone=data.phone,
        password=data.password,
        location=data.location,
        role=data.role,
    )

    db.add(user)
    db.commit()
    db.refresh(user)

    return {
        "user_id": user.id,
        "name": user.name,
        "phone": user.phone,
        "location": user.location,
        "email": user.email,
        "profile_image": user.profile_image
    }

#---------------profile--------------

@app.get("/profile/{user_id}")
def get_profile(user_id: int, db: Session = Depends(get_db)):

    user = db.query(User).filter(User.id == user_id).first()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    history = db.query(History).filter(History.user_id == user_id).all()

    return {
        "user_id": user.id,
        "name": user.name,
        "phone": user.phone,
        "location": user.location,
        "email": user.email,
        "profile_image": user.profile_image,
        "history": [
            {
                "type": h.action_type,
                "result": h.result,
                "confidence": h.confidence,
                "date": h.date
            }
            for h in history
        ]
    }

@app.put("/profile/{user_id}")
def update_profile(user_id: int, data: dict, db: Session = Depends(get_db)):

    user = db.query(User).filter(User.id == user_id).first()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    user.name = data.get("name", user.name)
    user.phone = data.get("phone", user.phone)
    user.location = data.get("location", user.location)
    user.email = data.get("email", user.email)

    db.commit()
    db.refresh(user)

    return {
        "message": "Profile updated successfully",
        "user": {
            "user_id": user.id,
            "name": user.name,
            "phone": user.phone,
            "location": user.location,
            "email": user.email,
        }
    }

@app.post("/upload/profile/{user_id}")
def upload_profile(
    user_id: int,
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):

    user = db.query(User).filter(User.id == user_id).first()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    filename = f"{user_id}_{file.filename}"
    file_path = f"uploads/{filename}"

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    image_url = f"http://127.0.0.1:8000/uploads/{filename}"

    user.profile_image = image_url

    db.commit()
    db.refresh(user)

    return {
        "message": "uploaded",
        "profile_image": image_url
    }

# 🔥 ADD PRODUCT
@app.post("/add-product")
def add_product(data: ProductInput, db: Session = Depends(get_db)):

    product = Product(
        farmer_id=data.farmer_id,
        name=data.name,
        category=data.category,
        price=data.price,
        stock=data.stock,
        image=data.image,
        description=data.description
    )

    db.add(product)
    db.commit()
    db.refresh(product)

    return {
        "message": "Product added successfully"
    }


# 🔥 GET PRODUCTS
@app.get("/products")
def get_products(db: Session = Depends(get_db)):

    products = db.query(Product).all()

    return [
        {
            "id": p.id,
            "farmer_id": p.farmer_id,
            "name": p.name,
            "category": p.category,
            "price": p.price,
            "stock": p.stock,
            "image": p.image,
            "description": p.description
        }
        for p in products
    ]

# 🔥 DELETE PRODUCT
@app.delete("/delete-product/{product_id}")
def delete_product(
    product_id: int,
    db: Session = Depends(get_db)
):

    product = db.query(Product).filter(
        Product.id == product_id
    ).first()

    if not product:
        return {
            "message": "Product not found"
        }

    db.delete(product)
    db.commit()

    return {
        "message": "Product deleted"
    }

class CartInput(BaseModel):
    user_id: int
    product_id: int


# 🔥 ADD TO CART
@app.post("/add-to-cart")
def add_to_cart(
    data: CartInput,
    db: Session = Depends(get_db)
):

    cart_item = Cart(
        user_id=data.user_id,
        product_id=data.product_id,
        quantity=1
    )

    db.add(cart_item)
    db.commit()

    return {
        "message": "Added to cart"
    }

# 🔥 GET CART
@app.get("/cart/{user_id}")
def get_cart(
    user_id: int,
    db: Session = Depends(get_db)
):

    cart_items = db.query(Cart).filter(
        Cart.user_id == user_id
    ).all()

    result = []

    for item in cart_items:

        product = db.query(Product).filter(
            Product.id == item.product_id
        ).first()

        if product:

            result.append({
                "cart_id": item.id,
                "product_id": product.id,
                "name": product.name,
                "price": product.price,
                "image": product.image,
                "quantity": item.quantity
            })

    return result


class OrderInput(BaseModel):
    user_id: int


# 🔥 PLACE ORDER
@app.post("/place-order")
def place_order(
    data: OrderInput,
    db: Session = Depends(get_db)
):

    cart_items = db.query(Cart).filter(
        Cart.user_id == data.user_id
    ).all()

    if not cart_items:
        return {
            "message": "Cart is empty"
        }

    for item in cart_items:

        product = db.query(Product).filter(
            Product.id == item.product_id
        ).first()

        if product:

            order = Order(
                customer_id=data.user_id,
                farmer_id=product.farmer_id,
                product_id=product.id,
                quantity=item.quantity,
                total_price=product.price * item.quantity,
                status="Pending"
            )

            db.add(order)

    # 🔥 COMMIT IMPORTANT
    db.commit()

    # 🔥 CLEAR CART
    db.query(Cart).filter(
        Cart.user_id == data.user_id
    ).delete()

    db.commit()

    return {
        "message": "Order placed successfully"
    }

# 🔥 FARMER ORDERS
@app.get("/farmer-orders/{farmer_id}")
def farmer_orders(
    farmer_id: int,
    db: Session = Depends(get_db)
):

    orders = db.query(Order).filter(
        Order.farmer_id == farmer_id
    ).all()

    result = []

    for order in orders:

        product = db.query(Product).filter(
            Product.id == order.product_id
        ).first()

        customer = db.query(User).filter(
            User.id == order.customer_id
        ).first()

        if product and customer:

            result.append({
                "order_id": order.id,
                "customer_name": customer.name,
                "customer_phone": customer.phone,
                "product_name": product.name,
                "quantity": order.quantity,
                "total_price": order.total_price,
                "status": order.status
            })

    return result

# 🔥 UPDATE ORDER STATUS
@app.put("/update-order/{order_id}")
def update_order(
    order_id: int,
    data: dict,
    db: Session = Depends(get_db)
):

    order = db.query(Order).filter(
        Order.id == order_id
    ).first()

    if not order:
        return {
            "message": "Order not found"
        }

    order.status = data["status"]

    db.commit()

    return {
        "message": "Status updated"
    }

# 🔥 CUSTOMER ORDERS
@app.get("/customer-orders/{customer_id}")
def customer_orders(
    customer_id: int,
    db: Session = Depends(get_db)
):

    orders = db.query(Order).filter(
        Order.customer_id == customer_id
    ).all()

    result = []

    for order in orders:

        product = db.query(Product).filter(
            Product.id == order.product_id
        ).first()

        if product:

            result.append({
                "order_id": order.id,
                "product_name": product.name,
                "image": product.image,
                "quantity": order.quantity,
                "total_price": order.total_price,
                "status": order.status
            })

    return result