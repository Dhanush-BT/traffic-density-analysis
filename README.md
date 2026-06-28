# HELIOS - Multi-Lane Intelligent Traffic Controller 🚦

HELIOS is an intelligent, real-time traffic signal arbitration system that utilizes deep learning computer vision models to dynamically optimize signal timings at a junction. 

Rather than relying on fixed-time intervals, HELIOS dynamically detects traffic density on individual lanes and uses a custom **Priority Score (PS)** algorithm to arbitrate green light cycles.

---

## 🌟 Key Features

- 📹 **Multi-Lane Junction Simulation**: Supports configuring 1 to 4 lanes with independent feeds (live webcam stream or video files).
- 🧠 **SigLIP AI Image Classifier**: Integrates fine-tuned **SigLIP** (`Traffic-Density-Classification`) to classify traffic density into 4 states: *No Traffic, Low Traffic, Medium Traffic, High Traffic*.
- ⏱️ **Priority Score (PS) Arbitration**: Dynamically adjusts green lights based on traffic density and accumulated wait times (preventing lanes from being starved).
- ⚡ **Dual Execution Modes**:
  - **Serverless Mode (Free Hugging Face API)**: Runs completely serverless directly from the browser (ideal for web deployment, free of cost and credits).
  - **Local Mode (FastAPI + PyTorch)**: Executes model inference locally on a Python backend.
- 🚀 **GitHub Pages Ready**: Fully configured for static export and deployment via automated GitHub Actions.

---

## 🛠️ Tech Stack

- **Frontend**: Next.js 16 (App Router, TSX), TailwindCSS, Lucide Icons, Shadcn UI
- **Backend (Optional Local Mode)**: FastAPI, Uvicorn, PyTorch, Transformers, OpenCV
- **Inference Model**: SigLIP (`prithivMLmods/Traffic-Density-Classification`) fine-tuned from `google/siglip2-base-patch16-224`

---

## 🚀 Quick Start & Installation

### Option 1: Running Serverless (No installation needed)
You can access the live, serverless deployment at your GitHub Pages link:
👉 **[https://Dhanush-BT.github.io/traffic-density-analysis/](https://Dhanush-BT.github.io/traffic-density-analysis/)**

*Just select **Serverless (Hugging Face API)** in the Inference Engine settings during Step 2.*

### Option 2: Running Locally
For full instructions on setting up the local Python FastAPI backend and the Next.js development environment, please see:
👉 **[RUNNING.md](./RUNNING.md)**

---

## 📄 License

This project is licensed under the Apache-2.0 License. See the [MODEL LICENSE](./MODEL/Traffic-Density-Classification/README.md) for details.
