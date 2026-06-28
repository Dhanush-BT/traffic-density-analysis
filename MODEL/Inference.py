import torch
from transformers import DetrImageProcessor, DetrForObjectDetection
from PIL import Image, ImageDraw, ImageFont
import requests
import argparse
import os
import cv2
import numpy as np
import time

def load_model(model_id="hilmantm/detr-traffic-accident-detection"):
    print(f"Loading model: {model_id}...")
    device = "cuda" if torch.cuda.is_available() else "cpu"
    print(f"Using device: {device}")
    processor = DetrImageProcessor.from_pretrained(model_id)
    model = DetrForObjectDetection.from_pretrained(model_id).to(device)
    return processor, model, device

def process_frame(frame, processor, model, device, threshold=0.7):
    # Convert OpenCV BGR to PIL RGB
    image = Image.fromarray(cv2.cvtColor(frame, cv2.COLOR_BGR2RGB))
    
    # Preprocess and run inference
    inputs = processor(images=image, return_tensors="pt").to(device)
    with torch.no_grad():
        outputs = model(**inputs)

    # Post-process results
    target_sizes = torch.tensor([image.size[::-1]])
    results = processor.post_process_object_detection(outputs, target_sizes=target_sizes, threshold=threshold)[0]
    
    return results

def draw_on_frame(frame, results, id2label):
    for score, label, box in zip(results["scores"], results["labels"], results["boxes"]):
        box = [int(i) for i in box.tolist()]
        label_name = id2label[label.item()]
        confidence = round(score.item(), 3)
        
        # Draw bounding box
        cv2.rectangle(frame, (box[0], box[1]), (box[2], box[3]), (0, 0, 255), 2)
        
        # Draw label and score
        text = f"{label_name}: {confidence}"
        cv2.putText(frame, text, (box[0], box[1] - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 0, 255), 2)
    
    return frame

def run_image_inference(image_path, threshold=0.7, output_path="result.jpg"):
    processor, model, device = load_model()
    
    # Load an input image
    if image_path.startswith("http"):
        image = Image.open(requests.get(image_path, stream=True).raw).convert("RGB")
    else:
        image = Image.open(image_path).convert("RGB")
    
    print("Running inference...")
    # Preprocess and run inference
    inputs = processor(images=image, return_tensors="pt").to(device)
    with torch.no_grad():
        outputs = model(**inputs)

    # Post-process results
    target_sizes = torch.tensor([image.size[::-1]])
    results = processor.post_process_object_detection(outputs, target_sizes=target_sizes, threshold=threshold)[0]

    # Draw results on the image
    draw = ImageDraw.Draw(image)
    try:
        font = ImageFont.truetype("arial.ttf", 20)
    except IOError:
        font = ImageFont.load_default()

    for score, label, box in zip(results["scores"], results["labels"], results["boxes"]):
        box = [round(i, 2) for i in box.tolist()]
        label_name = model.config.id2label[label.item()]
        confidence = round(score.item(), 3)
        
        print(f"Detected {label_name} with confidence {confidence} at location {box}")
        draw.rectangle(box, outline="red", width=3)
        text = f"{label_name}: {confidence}"
        draw.text((box[0], box[1] - 25), text, fill="red", font=font)

    # Save the output image
    image.save(output_path)
    print(f"Result saved to {output_path}")

def run_video_inference(source, threshold=0.7):
    processor, model, device = load_model()
    
    # Open video source
    if source.isdigit():
        source = int(source)
    cap = cv2.VideoCapture(source)
    
    if not cap.isOpened():
        print(f"Error: Could not open video source {source}")
        return

    print("Starting video inference. Press 'q' to quit.")
    
    while True:
        ret, frame = cap.read()
        if not ret:
            break
            
        start_time = time.time()
        
        # Run inference
        results = process_frame(frame, processor, model, device, threshold)
        
        # Draw results
        frame = draw_on_frame(frame, results, model.config.id2label)
        
        # Calculate and display FPS
        fps = 1.0 / (time.time() - start_time)
        cv2.putText(frame, f"FPS: {round(fps, 2)}", (10, 30), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)
        
        # Show frame
        cv2.imshow("Traffic Accident Detection", frame)
        
        if cv2.waitKey(1) & 0xFF == ord('q'):
            break
            
    cap.release()
    cv2.destroyAllWindows()

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Run inference for traffic accident detection.")
    parser.add_argument("--image", help="Path or URL to the image.")
    parser.add_argument("--video", help="Path to video file or webcam index (e.g., 0).")
    parser.add_argument("--threshold", type=float, default=0.7, help="Confidence threshold (default: 0.7).")
    parser.add_argument("--output", default="result.jpg", help="Output path for the resulting image (only for --image).")
    
    args = parser.parse_args()
    
    if args.video:
        run_video_inference(args.video, args.threshold)
    elif args.image:
        run_image_inference(args.image, args.threshold, args.output)
    else:
        print("Please provide either --image or --video source.")