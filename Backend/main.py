from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from contextlib import asynccontextmanager

import torch
import torch.nn as nn
from torchvision import models, transforms
from PIL import Image

import joblib
import json
import numpy as np
import io
import os

# ─────────────────────────────────────────
# CONFIG
# ─────────────────────────────────────────
DISEASE_MODEL_PATH  = "ml_models/disease_model.pth"
YIELD_MODEL_PATH    = "ml_models/yield_model.pkl"
YIELD_ENCODER_PATH  = "ml_models/label_encoders.pkl"
YIELD_META_PATH     = "ml_models/model_meta.json"

DEVICE = "cuda" if torch.cuda.is_available() else "cpu"

# Globals
disease_model    = None
disease_classes  = None
disease_img_size = 224

yield_rf_model   = None
yield_encoders   = None
yield_meta       = None


# ─────────────────────────────────────────
# LOAD MODELS
# ─────────────────────────────────────────
def load_disease_model():
    global disease_model, disease_classes, disease_img_size

    if not os.path.exists(DISEASE_MODEL_PATH):
        print("❌ disease_model not found")
        return

    print("✅ Loading disease model...")

    ckpt = torch.load(DISEASE_MODEL_PATH, map_location=DEVICE)

    disease_classes  = ckpt["classes"]
    disease_img_size = ckpt.get("img_size", 224)
    num_classes      = len(disease_classes)

    base = models.resnet50(weights=None)
    base.fc = nn.Sequential(
        nn.Dropout(0.5),
        nn.Linear(base.fc.in_features, 512),
        nn.ReLU(),
        nn.Dropout(0.3),
        nn.Linear(512, num_classes)
    )

    base.load_state_dict(ckpt["model_state_dict"])
    base.to(DEVICE).eval()

    disease_model = base

    print(f"🔥 Disease model ready → {disease_classes}")


def load_yield_model():
    global yield_rf_model, yield_encoders, yield_meta

    if not os.path.exists(YIELD_MODEL_PATH):
        print("❌ yield_model not found")
        return

    print("✅ Loading yield model...")

    yield_rf_model = joblib.load(YIELD_MODEL_PATH)
    yield_encoders = joblib.load(YIELD_ENCODER_PATH)

    with open(YIELD_META_PATH) as f:
        yield_meta = json.load(f)


@asynccontextmanager
async def lifespan(app: FastAPI):
    load_disease_model()
    load_yield_model()
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
async def predict_disease(file: UploadFile = File(...)):

    if disease_model is None:
        raise HTTPException(500, "Model not loaded")

    if not file.content_type.startswith("image/"):
        raise HTTPException(400, "Upload image file")

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

    # 🔥 REAL AI LOGIC
    if confidence > 0.75:
        severity = "High"
    elif confidence > 0.4:
        severity = "Medium"
    else:
        severity = "Low"

    yield_loss = int(confidence * 50)

    explanation = f"The model is {round(confidence*100,2)}% confident that the crop has {disease.replace('_',' ')}."

    # top 5 predictions
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