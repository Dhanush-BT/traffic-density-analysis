from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import torch
from transformers import AutoImageProcessor, SiglipForImageClassification
from PIL import Image
import io
import base64
import numpy as np
import os

app = FastAPI()

# Enable CORS for the Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "https://dhanush-bt.github.io"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load Model
MODEL_PATH = "./Traffic-Density-Classification"
try:
    print(f"Loading density model from {MODEL_PATH}...")
    device = "cuda" if torch.cuda.is_available() else "cpu"
    processor = AutoImageProcessor.from_pretrained(MODEL_PATH)
    model = SiglipForImageClassification.from_pretrained(MODEL_PATH).to(device)
    id2label = model.config.id2label
    print(f"Model loaded successfully on {device}")
except Exception as e:
    print(f"Error loading model: {e}")
    # Fallback or exit if model is critical
    processor, model, device, id2label = None, None, None, {}

@app.post("/analyze-frame")
async def analyze_frame(data: dict):
    if not model:
        raise HTTPException(status_code=500, detail="Model not loaded")
    
    try:
        # Decode base64 image
        image_data = data.get("image")
        if not image_data:
            raise HTTPException(status_code=400, detail="No image data provided")
        
        # Remove header if present (e.g., "data:image/jpeg;base64,")
        if "," in image_data:
            image_data = image_data.split(",")[1]
            
        image_bytes = base64.b64decode(image_data)
        image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
        
        # Preprocess and Inference
        inputs = processor(images=image, return_tensors="pt").to(device)
        with torch.no_grad():
            outputs = model(**inputs)
            probs = torch.nn.functional.softmax(outputs.logits, dim=1)
            # Get all probabilities
            all_probs = probs[0].tolist()
            top_class = torch.argmax(probs, dim=1).item()
            
            # Helper to get label safely
            def get_label(idx):
                if idx in id2label: return id2label[idx]
                if str(idx) in id2label: return id2label[str(idx)]
                return f"class_{idx}"

            label = get_label(top_class)
            confidence = all_probs[top_class]

            # Logic for Signal
            signal = "GREEN"
            if "high-traffic" in label:
                signal = "RED"
            elif "medium-traffic" in label:
                signal = "YELLOW"
            
            return {
                "label": label,
                "confidence": confidence,
                "signal": signal,
                "probabilities": {get_label(i): p for i, p in enumerate(all_probs)}
            }
            
    except Exception as e:
        print(f"Inference error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
async def health():
    return {"status": "ok", "model_loaded": model is not None}

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
