import torch
import cv2
import numpy as np
import time
import argparse
from transformers import AutoImageProcessor, SiglipForImageClassification
from PIL import Image

def load_density_model(model_path="./Traffic-Density-Classification"):
    print(f"Loading density model from {model_path}...")
    device = "cuda" if torch.cuda.is_available() else "cpu"
    print(f"Using device: {device}")
    
    processor = AutoImageProcessor.from_pretrained(model_path)
    model = SiglipForImageClassification.from_pretrained(model_path).to(device)
    
    return processor, model, device

def get_signal_timing(label):
    # Mapping based on model config:
    # 0: high-traffic, 1: low-traffic, 2: medium-traffic, 3: no-traffic
    timings = {
        "high-traffic": 60,
        "medium-traffic": 30,
        "low-traffic": 15,
        "no-traffic": 5
    }
    return timings.get(label, 30)

def main():
    parser = argparse.ArgumentParser(description="Traffic Signal Controller based on Density")
    parser.add_argument("--video", required=True, help="Path to video file or webcam index")
    parser.add_argument("--model", default="./Traffic-Density-Classification", help="Path to local density model")
    args = parser.parse_args()

    processor, model, device = load_density_model(args.model)
    id2label = model.config.id2label

    source = int(args.video) if args.video.isdigit() else args.video
    cap = cv2.VideoCapture(source)

    if not cap.isOpened():
        print(f"Error: Could not open video source {source}")
        return

    current_state = "GREEN"
    time_remaining = 0
    current_density = "unknown"
    
    print("Starting Signal Controller. Press 'q' to quit.")

    # Frequency of AI inference (every 30 frames to save CPU)
    frame_count = 0
    inference_interval = 30 
    
    last_time = time.time()

    while True:
        ret, frame = cap.read()
        if not ret:
            break

        frame_count += 1
        now = time.time()
        dt = now - last_time
        last_time = now

        # Run AI Inference periodically to check density
        if frame_count % inference_interval == 0 or time_remaining <= 0:
            pil_img = Image.fromarray(cv2.cvtColor(frame, cv2.COLOR_BGR2RGB))
            inputs = processor(images=pil_img, return_tensors="pt").to(device)
            
            with torch.no_grad():
                outputs = model(**inputs)
                probs = torch.nn.functional.softmax(outputs.logits, dim=1)
                top_class = torch.argmax(probs, dim=1).item()
                # Ensure the key is in the correct format (int or str)
                current_density = id2label[top_class] if top_class in id2label else id2label.get(str(top_class), "unknown")

            # If signal just finished or sensing changed significantly, reset timer
            if time_remaining <= 0:
                time_remaining = get_signal_timing(current_density)
                current_state = "GREEN"

        # Signal State Machine logic (Simulation)
        if time_remaining > 0:
            time_remaining -= dt
        
        # UI Overlay - Visual Signal
        overlay = frame.copy()
        
        # Draw Signal Circle
        color = (0, 255, 0) # Green
        if time_remaining < 3:
            current_state = "YELLOW"
            color = (0, 255, 255) # Yellow
        if time_remaining <= 0:
            current_state = "RED (Next Cycle)"
            color = (0, 0, 255) # Red

        cv2.circle(frame, (50, 50), 30, color, -1)
        cv2.putText(frame, f"SIGNAL: {current_state}", (100, 45), cv2.FONT_HERSHEY_SIMPLEX, 1, color, 2)
        cv2.putText(frame, f"Density: {current_density}", (10, 110), cv2.FONT_HERSHEY_SIMPLEX, 0.8, (255, 255, 255), 2)
        cv2.putText(frame, f"Sec Remaining: {max(0, int(time_remaining))}", (10, 150), cv2.FONT_HERSHEY_SIMPLEX, 0.8, (255, 255, 255), 2)

        cv2.imshow("Smart Traffic Signal Controller", frame)

        if cv2.waitKey(1) & 0xFF == ord('q'):
            break

    cap.release()
    cv2.destroyAllWindows()

if __name__ == "__main__":
    main()
