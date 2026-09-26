# ResiNet — Dynamic Wireless Network Intrusion Detection  | Live : https://resilient-net-2.onrender.com/

ResiNet is a web-based network intelligence and intrusion detection system for monitoring dynamic wireless/ad-hoc networks.

The system visualizes network snapshots, node-level network behaviour, attack labels, model predictions, trust scores, and network topology through an interactive dashboard.

## Features

* Dynamic network topology visualization
* Snapshot-based network monitoring
* Automatic snapshot playback
* Adjustable playback speed
* Node-level information and statistics
* Ground-truth attack labels
* GAT model predictions
* Normal and malicious probability information
* Trust-score based network information
* FastAPI backend for serving network data
* Vite + React frontend
* REST API communication between frontend and backend
* Deployable frontend and backend using Render

---

# System Architecture

```text
                    ┌──────────────────────┐
                    │       User           │
                    │    Web Browser       │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │   React + Vite       │
                    │      Frontend        │
                    │   Render Static Site │
                    └──────────┬───────────┘
                               │
                         REST API / fetch()
                               │
                               ▼
                    ┌──────────────────────┐
                    │      FastAPI         │
                    │       Backend        │
                    │    Render Web App    │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │ Network Dataset &    │
                    │ Model Predictions    │
                    └──────────────────────┘
```

The frontend requests network snapshot data from the FastAPI backend using REST API endpoints.

---

# Technology Stack

## Frontend

* React
* Vite
* JavaScript
* CSS

## Backend

* Python
* FastAPI
* Uvicorn
* Pandas

## Machine Learning / Network Intelligence

* Graph-based network analysis
* GAT-based model predictions
* Network trust and traffic features

## Deployment

* GitHub
* Render

  * Static Site for frontend
  * Python Web Service for backend

---

# Project Structure

```text
Resilient-Net/
│
├── backend/
│   ├── data/
│   │   └── ...
│   │
│   ├── data_loader.py
│   ├── model.py
│   ├── main.py
│   └── requirements.txt
│
├── frontend/
│   ├── public/
│   │
│   ├── src/
│   │   ├── components/
│   │   │   ├── NetworkGraph.jsx
│   │   │   ├── NodeDetails.jsx
│   │   │   └── Statistics.jsx
│   │   │
│   │   ├── App.jsx
│   │   └── App.css
│   │
│   ├── package.json
│   ├── package-lock.json
│   ├── vite.config.js
│   └── index.html
│
└── README.md
```

---

# Backend

The backend is implemented using FastAPI.

Main backend file:

```text
backend/main.py
```

The backend loads network metadata, snapshots, node information, predictions, and attention information through `data_loader.py`.

## API Base URL

For the deployed application:

```text
https://resilient-net-1.onrender.com
```

## API Documentation

FastAPI automatically provides interactive API documentation at:

```text
https://resilient-net-1.onrender.com/docs
```

---

# API Endpoints

## 1. Root

```http
GET /
```

Returns:

```json
{
  "message": "ResiNet API is running"
}
```

---

## 2. Metadata

```http
GET /api/metadata
```

Returns information about the available network data and snapshots.

---

## 3. Network Snapshot

```http
GET /api/snapshot/{snapshot_id}
```

Example:

```text
/api/snapshot/0
```

The response contains:

* Snapshot ID
* Nodes
* Edges
* Predictions
* Attention information

Example response structure:

```json
{
  "snapshot": 0,
  "nodes": [],
  "edges": [],
  "predictions": [],
  "attention": []
}
```

---

## 4. Node Details

```http
GET /api/node/{snapshot_id}/{node_id}
```

Example:

```text
/api/node/0/3
```

Returns detailed information for a specific node in a particular snapshot.

---

## 5. Predictions

```http
GET /api/predictions/{snapshot_id}
```

Returns model predictions for the selected snapshot.

---

## 6. Attention

```http
GET /api/attention/{snapshot_id}
```

Returns attention information associated with the selected snapshot.

---

# Network Data

Each network snapshot contains node-level information such as:

```text
node_id
x
y
speed
packets_sent
packets_received
packets_forwarded
packets_dropped
drop_ratio
forwarding_ratio
delivery_ratio
packet_rate
degree
previous_trust
label
attack_type
trust_score
avg_neighbor_trust
snapshot
```

The system can represent normal and malicious nodes.

Example attack types include:

* Normal
* Blackhole
* Grayhole

---

# Frontend

The frontend is located inside:

```text
frontend/
```

It is developed using React and Vite.

The main application is:

```text
frontend/src/App.jsx
```

The frontend requests snapshot information from the deployed FastAPI backend.

The API request is configured as:

```javascript
fetch(`https://resilient-net-1.onrender.com/api/snapshot/${snapshot}`)
```

This means the deployed frontend does not depend on a local backend running on `localhost`.

---

# Automatic Snapshot Playback

ResiNet supports automatic playback of network snapshots.

The playback state is controlled by:

```javascript
const [playing, setPlaying] = useState(true);
```

The playback speed is configured using:

```javascript
const [speed, setSpeed] = useState(5);
```

The application automatically moves through snapshots:

```text
000 → 001 → 002 → 003 → ... → 999 → 000
```

The playback interval is controlled by:

```javascript
1000 / speed
```

The dashboard also provides playback controls for:

* Play
* Pause
* Previous snapshot
* Next snapshot
* Timeline navigation
* 0.5x speed
* 1x speed
* 2x speed
* 5x speed

---

# Initial Random Node Selection

When the application loads the first snapshot, a random node can be selected automatically.

The selected node's information is displayed in the Node Intelligence panel.

The selection is then synchronized with subsequent snapshots so that the same node can continue to be monitored as the network changes.

---

# CORS Configuration

Because the frontend and backend are deployed separately, the FastAPI backend must allow requests from the frontend.

For the current deployment configuration, CORS is configured in:

```text
backend/main.py
```

Example:

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

For a production environment with a fixed frontend domain, `allow_origins` can be restricted to the exact frontend URL instead of allowing all origins.

---

# Running Locally

## 1. Clone the repository

```bash
git clone https://github.com/kashish2710/Resilient-Net.git
cd Resilient-Net
```

---

# Running the Backend

Move into the backend directory:

```bash
cd backend
```

Create a virtual environment:

### macOS / Linux

```bash
python3 -m venv venv
source venv/bin/activate
```

### Windows

```bash
python -m venv venv
venv\Scripts\activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Start FastAPI:

```bash
uvicorn main:app --reload
```

The backend will normally be available at:

```text
http://127.0.0.1:8000
```

API documentation:

```text
http://127.0.0.1:8000/docs
```

---

# Running the Frontend

Open a new terminal and move to:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start the Vite development server:

```bash
npm run dev
```

The frontend will normally be available at:

```text
http://localhost:5173
```

---

# Local Frontend + Backend

For local development, the backend runs on:

```text
http://127.0.0.1:8000
```

and the frontend runs on:

```text
http://localhost:5173
```

If the frontend is being tested against the local backend, the API URL in `App.jsx` can be changed accordingly.

For the deployed version, the frontend uses:

```text
https://resilient-net-1.onrender.com
```

---

# Render Deployment

The application is deployed as two separate services.

## Backend

Render service type:

```text
Web Service
```

Configuration:

```text
Repository: kashish2710/Resilient-Net
Branch: main
Root Directory: backend
Language: Python 3
Build Command: pip install -r requirements.txt
Start Command: uvicorn main:app --host 0.0.0.0 --port $PORT
```

Backend URL:

```text
https://resilient-net-1.onrender.com
```

---

## Frontend

Render service type:

```text
Static Site
```

Configuration:

```text
Repository: kashish2710/Resilient-Net
Branch: main
Root Directory: frontend
Build Command: npm install && npm run build
Publish Directory: dist
```

The frontend receives its public URL from the Render Static Site service.

Open the Render dashboard and select the frontend Static Site service to access the deployed UI.

---
### Interactive Network Visualization

The ResiNet dashboard provides an interactive network graph where users can explore individual nodes in real time.

* **Click on any node** in the network graph to view its detailed information.
* The **Node Details** panel displays information related to the selected node, including:

  * Node ID
  * Current node status
  * Actual label (Normal / Malicious)
  * Predicted status
  * Normal probability
  * Malicious probability
* The selected node's information is automatically updated as the network simulation moves through different snapshots.
* The dashboard supports **automatic snapshot playback**, allowing users to observe how the network changes over time.
* Users can control playback using **Play/Pause, Previous/Next, Timeline, and Speed controls (0.5x, 1x, 2x, 5x)**.
  
---

# Deployment Workflow

After making changes locally:

```bash
git add .
git commit -m "Describe your change"
git push
```

Render automatically detects the new commit and redeploys the corresponding service.

For example:

```text
Change backend
    ↓
git push
    ↓
Render Backend redeploys

Change frontend
    ↓
git push
    ↓
Render Frontend rebuilds
```

There is no need to manually create a new Render service after every code change.

---

# Important Deployment Notes

### Backend URL

The frontend currently communicates with:

```text
https://resilient-net-1.onrender.com
```

If the backend Render URL changes, update the API URL inside:

```text
frontend/src/App.jsx
```

---

### CORS

If the frontend displays:

```text
INITIALIZING NETWORK INTELLIGENCE...
```

indefinitely, check:

1. Backend is running.
2. `/api/snapshot/0` returns JSON.
3. CORS allows the frontend origin.
4. Browser console does not show a CORS error.

The snapshot endpoint can be tested directly:

```text
https://resilient-net-1.onrender.com/api/snapshot/0
```

---

### Render Free Tier

The backend is deployed on Render's free service tier. A free backend service may spin down after a period of inactivity.

Consequently, the first API request after inactivity can take longer while the service starts again.

---

# Git and Dependency Management

The Python virtual environment should not be committed to Git.

The repository ignores:

```text
venv/
.venv/
env/
backend/venv/
backend/.venv/
```

Frontend dependencies are also excluded:

```text
frontend/node_modules/
```

Python dependencies are specified in:

```text
backend/requirements.txt
```

Frontend dependencies are specified in:

```text
frontend/package.json
```

---

# Development Workflow

A typical development workflow is:

```text
1. Modify frontend/backend
        ↓
2. Test locally
        ↓
3. git add
        ↓
4. git commit
        ↓
5. git push
        ↓
6. Render automatically deploys
        ↓
7. Test deployed application
```

---

# Project Status

ResiNet currently consists of:

* React/Vite frontend
* FastAPI backend
* Snapshot-based dynamic network visualization
* Node-level network intelligence
* Attack ground-truth information
* GAT model prediction information
* Automatic snapshot playback
* REST API backend
* GitHub source control
* Render deployment

---

# Repository

GitHub:

https://github.com/kashish2710/Resilient-Net

Backend:

https://resilient-net-1.onrender.com

API Documentation:

https://resilient-net-1.onrender.com/docs
