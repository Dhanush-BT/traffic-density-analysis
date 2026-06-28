# Running the Application

This project consists of a **Next.js frontend** and a **FastAPI backend**. Follow the steps below to get the application up and running.

---

## 1. Prerequisites

Ensure you have the following installed on your system:
- **Node.js** (v18 or higher)
- **Python** (v3.10 or higher)
- **npm** (comes with Node.js)

---

## 2. Backend Setup (FastAPI)

The backend handles image analysis using AI models.

1.  **Navigate to the MODEL directory**:
    ```powershell
    cd MODEL
    ```

2.  **Create and activate a Virtual Environment**:
    - **Creation**:
      ```powershell
      python -m venv .venv
      ```
    - **Activation (PowerShell)**:
      ```powershell
      .venv\Scripts\Activate.ps1
      ```
    - **Activation (Command Prompt/CMD)**:
      ```cmd
      .venv\Scripts\activate.bat
      ```

3.  **Install Dependencies**:
    Once the virtual environment is active, install the necessary packages:
    ```powershell
    pip install fastapi uvicorn[standard] torch torchvision transformers pillow opencv-python numpy requests
    ```

4.  **Run the Backend**:
    ```powershell
    python video_api.py
    ```
    The backend will start at `http://localhost:8000`.

---

## 3. Frontend Setup (Next.js)

The frontend provides the user interface.

1.  **Navigate to the WEB directory**:
    If you are currently in the `MODEL` folder, go back first:
    ```powershell
    cd ..
    cd WEB
    ```

2.  **Install Dependencies**:
    ```bash
    npm install
    ```

3.  **Run the Development Server**:
    ```bash
    npm run dev
    ```
    The frontend will start at `http://localhost:3000`.

---

## 4. How to Use

1.  Open your browser and navigate to `http://localhost:3000/analysis`.
2.  **Step 1**: Choose the number of lanes for your junction.
3.  **Step 2**: Configure each lane by linking a **Webcam** or uploading a **Video File**.
4.  **Step 3**: Click **"Confirm Configuration & Launch"**.
5.  On the dashboard, click **"Initialize Matrix"** to start the real-time AI analysis.

> [!IMPORTANT]
> Ensure the Backend is running before clicking "Initialize Matrix", as the frontend sends frames to `http://localhost:8000` for analysis.
