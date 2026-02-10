# Smart Attendance & Proxy Detection System

A MERN stack application for role-based attendance with proxy detection using geolocation, face recognition, and device fingerprinting.

## Features

- **Roles**: Student, Teacher, Admin
- **Authentication**: JWT, bcrypt password hashing
- **Proxy Detection**: Geolocation (Haversine), Face recognition (face-api.js), Device fingerprint
- **Fraud Scoring**: Outside radius (+40), Face mismatch (+50), Same device multiple accounts (+30)
- **Status**: Present, Suspicious (fraud > 60), Rejected

## Tech Stack

- **Backend**: Node.js, Express, MongoDB (Mongoose), JWT, bcrypt
- **Frontend**: React, Vite, axios, react-webcam, face-api.js
- **Styling**: Plain CSS (no framework)

---

## Algorithms Used & How They Work

### 1. Haversine Formula (Distance Calculation)

**Purpose:** Calculate the real-world distance (in meters) between the student's current location and the classroom.

**How it works:**
- Takes two latitude/longitude pairs: classroom location and student's GPS location
- Uses Earth's radius (6,371 km) and spherical trigonometry
- Converts degrees to radians, then applies:
  - `a = sin²(Δφ/2) + cos(φ1)·cos(φ2)·sin²(Δλ/2)`
  - `c = 2·atan2(√a, √(1−a))`
  - `distance = R × c`

**Used when:** A student marks attendance. If the distance is greater than the teacher-defined classroom radius, the attendance is flagged.

---

### 2. Euclidean Distance (Face Comparison)

**Purpose:** Compare the student's live face embedding with their registered face embedding to verify identity.

**How it works:**
- face-api.js extracts a 128-dimensional descriptor (embedding) for each face
- Euclidean distance between two embeddings: `√Σ(ai − bi)²`
- Lower distance = more similar faces
- **Threshold:** 0.65 — if distance ≤ 0.65, faces are considered a match
- If distance > 0.65, it's treated as a face mismatch (possible proxy)

**Flow:**
1. **Registration:** Student captures face via react-webcam → face-api.js extracts embedding → stored in MongoDB
2. **Marking attendance:** Student captures face → embedding extracted → sent to backend → compared with stored embedding using Euclidean distance

---

### 3. Device Fingerprinting

**Purpose:** Detect if the same device is used by multiple student accounts (proxy/impersonation).

**How it works:**
- Combines browser/device attributes: `userAgent`, `language`, `screen` dimensions, `colorDepth`, `timezoneOffset`, `hardwareConcurrency`, `platform`
- Concatenates into a string and hashes using a simple djb2-style hash
- Produces a stable ID like `fp_abc123`
- If a device ID appears for more than one student account, it adds to the fraud score

---

### 4. Fraud Scoring System

**Purpose:** Combine all checks into a single score and decide attendance status.

**Rules:**

| Condition | Fraud Points |
|-----------|--------------|
| Outside allowed classroom radius | +40 |
| Face does not match registered profile | +50 |
| Same device used by multiple accounts | +30 |

**Status logic:**
- **Present:** fraud score = 0
- **Suspicious:** fraud score > 0 and ≤ 60
- **Rejected:** fraud score > 60, or both face mismatch AND outside radius

**Note:** Teachers can override with **Accept** or **Ignore** on suspicious attempts.

---

## Setup

### Backend

```bash
cd backend
npm install
```

Create `backend/.env` (see `backend/.env.example`):

```
MONGO_URL=your_mongodb_connection_string
PORT=5000
JWT_SECRET=your_secret
CLIENT_URL=http://localhost:5173
```

Seed data (admin/teacher/student users with password `123456`):

```bash
npm run seed
```

Start server:

```bash
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Create `frontend/.env`:

```
VITE_API_URL=http://localhost:5000
```

Frontend runs at `http://localhost:5173`.

## Face API Models

Face recognition loads models from CDN. For offline use, download weights from [face-api.js](https://github.com/justadudewhohacks/face-api.js) and place in `frontend/public/models/`.

## Seed Users

| Role    | Email            | Password |
|---------|------------------|----------|
| Admin   | admin@test.com   | 123456   |
| Teacher | teacher@test.com | 123456   |
| Student | student@test.com | 123456   |
