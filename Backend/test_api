import requests
import json

BASE_URL = "http://localhost:8000"

def test_health():
    print("\n1️⃣  Testing /health ...")
    r = requests.get(f"{BASE_URL}/health")
    print(f"   Status : {r.status_code}")
    print(f"   Body   : {json.dumps(r.json(), indent=4)}")
    assert r.status_code == 200, "Health check failed!"
    print("   ✅ PASSED")


def test_yield_options():
    print("\n2️⃣  Testing /yield/options ...")
    r = requests.get(f"{BASE_URL}/yield/options")
    print(f"   Status     : {r.status_code}")
    data = r.json()
    print(f"   Crop types : {data['crop_types']}")
    print(f"   Soil types : {data['soil_types']}")
    print(f"   Model R²   : {data['model_r2']}")
    assert r.status_code == 200, "Yield options failed!"
    print("   ✅ PASSED")


def test_yield_prediction():
    print("\n3️⃣  Testing /predict/yield ...")
    payload = {
        "crop_type"   : "Wheat",
        "soil_type"   : "Loamy",
        "soil_ph"     : 6.5,
        "temperature" : 28.0,
        "humidity"    : 65.0,
        "wind_speed"  : 12.0,
        "n"           : 90.0,
        "p"           : 45.0,
        "k"           : 45.0,
        "soil_quality": 7.5
    }
    print(f"   Input  : {json.dumps(payload, indent=4)}")
    r = requests.post(f"{BASE_URL}/predict/yield", json=payload)
    print(f"   Status : {r.status_code}")
    print(f"   Result : {json.dumps(r.json(), indent=4)}")
    assert r.status_code == 200, f"Yield prediction failed: {r.text}"
    print("   ✅ PASSED")


def test_yield_invalid_crop():
    print("\n4️⃣  Testing /predict/yield with invalid crop (should return 400)...")
    payload = {
        "crop_type"   : "InvalidCrop",
        "soil_type"   : "Loamy",
        "soil_ph"     : 6.5,
        "temperature" : 28.0,
        "humidity"    : 65.0,
        "wind_speed"  : 12.0,
        "n"           : 90.0,
        "p"           : 45.0,
        "k"           : 45.0,
        "soil_quality": 7.5
    }
    r = requests.post(f"{BASE_URL}/predict/yield", json=payload)
    print(f"   Status : {r.status_code}")
    print(f"   Body   : {r.json()}")
    assert r.status_code == 400, "Should have returned 400 for invalid crop!"
    print("   ✅ PASSED (correctly rejected invalid crop)")


def test_disease_classes():
    print("\n5️⃣  Testing /disease/classes ...")
    r = requests.get(f"{BASE_URL}/disease/classes")
    print(f"   Status  : {r.status_code}")
    if r.status_code == 200:
        data = r.json()
        print(f"   Classes : {data['classes']}")
        print(f"   Count   : {data['count']}")
        print("   ✅ PASSED")
    else:
        print(f"   ⚠️  Disease model not loaded yet — add disease_model.pth to ml_models/")


def test_disease_prediction():
    print("\n6️⃣  Testing /predict/disease with a test image ...")
    # Create a tiny dummy image for testing
    from PIL import Image
    import io
    img = Image.new("RGB", (224, 224), color=(100, 150, 80))
    buf = io.BytesIO()
    img.save(buf, format="JPEG")
    buf.seek(0)

    r = requests.post(
        f"{BASE_URL}/predict/disease",
        files={"file": ("test_leaf.jpg", buf, "image/jpeg")}
    )
    print(f"   Status : {r.status_code}")
    if r.status_code == 200:
        data = r.json()
        print(f"   Disease   : {data['disease']}")
        print(f"   Confidence: {data['confidence']}")
        print(f"   Treatment : {data['treatment']}")
        print("   ✅ PASSED")
    elif r.status_code == 503:
        print(f"   ⚠️  Disease model not loaded — add disease_model.pth to ml_models/")
    else:
        print(f"   ❌ FAILED: {r.text}")


if __name__ == "__main__":
    print("=" * 55)
    print("  AgroPestro API Test Suite")
    print("  Make sure FastAPI is running: uvicorn main:app --reload")
    print("=" * 55)

    try:
        test_health()
        test_yield_options()
        test_yield_prediction()
        test_yield_invalid_crop()
        test_disease_classes()
        test_disease_prediction()

        print("\n" + "=" * 55)
        print("  All tests done! 🌾")
        print("  Open http://localhost:8000/docs for Swagger UI")
        print("=" * 55)

    except requests.exceptions.ConnectionError:
        print("\n❌ Cannot connect to API!")
        print("   Start FastAPI first: uvicorn main:app --reload")
