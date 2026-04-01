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

import joblib
import json
import numpy as np
import io
import os
import torch
import torch.nn as nn
import shutil

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

engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(bind=engine)
Base = declarative_base()

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

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    phone = Column(String)
    location = Column(String)


class History(Base):
    __tablename__ = "history"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer)
    disease = Column(String)
    confidence = Column(String)
    date = Column(String)

Base.metadata.create_all(bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@asynccontextmanager
async def lifespan(app: FastAPI):
    load_disease_model()
    load_yield_model()
    load_time_series_model()
    yield


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
    from datetime import datetime

    history = History(
        user_id=user_id,
        disease=disease,
        confidence=str(round(confidence, 3)),
        date=str(datetime.now())
    )

    db.add(history)
    db.commit()

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
def predict_yield(data: YieldInput):

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

    return {
        "predicted_yield": round(pred, 2),
        "unit": "tonnes/hectare"
    }

class TimeSeriesInput(BaseModel):
    start_date: date
    end_date: date

@app.post("/predict/timeseries")
def predict_timeseries(data: TimeSeriesInput):

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

    return {
        "dates": [str(d) for d in dates],
        "predicted_yield": [float(p) for p in preds]
    }

class ImpactInput(BaseModel):
    soil_type: str
    temperature: float
    humidity: float


@app.post("/predict/impact")
def predict_impact(data: ImpactInput):

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

    return {
        "yield_loss": impact,
        "fertilizer": fertilizer,
        "status": "High Risk" if impact > 40 else "Moderate" if impact > 20 else "Low Risk"
    }

class LoginInput(BaseModel):
    name: str
    phone: str
    location: str


@app.post("/login")
def login(data: LoginInput, db: Session = Depends(get_db)):

    user = db.query(User).filter(User.phone == data.phone).first()

    if user:
        # 🔥 UPDATE EXISTING USER
        user.name = data.name
        user.location = data.location
        db.commit()
        db.refresh(user)

    else:
        # 🔥 CREATE NEW USER
        user = User(
            name=data.name,
            phone=data.phone,
            location=data.location
        )
        db.add(user)
        db.commit()
        db.refresh(user)

    return {
        "user_id": user.id,
        "name": user.name,
        "phone": user.phone,
        "location": user.location
    }

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
        "history": [
            {
                "disease": h.disease,
                "confidence": h.confidence,
                "date": h.date
            }
            for h in history
        ]
    }

@app.post("/upload/profile/{user_id}")
def upload_profile(user_id: int, file: UploadFile = File(...), db: Session = Depends(get_db)):

    file_path = f"uploads/{user_id}_{file.filename}"

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    user = db.query(User).filter(User.id == user_id).first()
    user.profile_image = file_path
    db.commit()

    return {"message": "uploaded", "path": file_path}