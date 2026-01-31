# 🏥 Healing Wave — Hospital Management Portal

[![MERN Stack](https://img.shields.io/badge/Stack-MERN-blue.svg)](https://mongodb.com)
[![Docker](https://img.shields.io/badge/Deployment-Docker-blue.svg)](https://docker.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A sophisticated, full-stack medical ecosystem designed to bridge the gap between healthcare providers and patients. **Healing Wave** combines a "Dark Premium" aesthetic with robust administrative tools, real-time AI assistance, and seamless resource management.

---

## ✨ Key Highlights

- **🌑 Dark Premium UI**: A modern, glassmorphic design language using vibrant gradients and smooth micro-animations.
- **🤖 AI Health Bot**: Integrated intelligent chatbot for instant patient guidance and triage.
- **🔐 Multi-Role Access**: Dedicated portals for **Admins**, **Doctors**, and **Patients** with secure JWT-based authorization.
- **🩸 Blood Bank & Pharmacy**: Centralized modules for managing blood availability, donors, and medicine inventory.

---

## 🏗️ Project Architecture

### **📁 FRONTEND (React.js)**
```text
FRONTEND/
├── public/                 # Static assets & index.html
├── src/
│   ├── api/                # API configurations & axios interceptors
│   ├── assets/             # Branding, icons, and premium UI images
│   ├── components/         # Core UI: Admin, Doctor, Patient portals
│   │   ├── styles/         # Module-specific "Dark Premium" CSS
│   │   └── Chatbot.js      # AI Triage & Help Assistant
│   ├── contexts/           # Theme & Auth state management
│   ├── services/           # Business logic & API abstraction
│   ├── App.js              # Routing & Layout orchestration
│   └── main.jsx            # Application entry point
├── Dockerfile              # Frontend containerization
└── package.json            # Dependencies & Scripts
```

### **� BACKEND (Node.js/Express)**
```text
BACKEND/
├── config/                 # DB & Environment configurations
├── middleware/             # Auth, Validation & Error Handlers
├── models/                 # Mongoose Schemas (User, Appt, Medicine, etc.)
├── routes/                 # API Endpoints (Admin, BloodBank, Pharmacy)
├── scripts/                # Database initialization & testing tools
├── uploads/                # Dynamic storage for medical records/images
├── index.js                # Server entry point
├── dbconnect.js            # MongoDB connection logic
└── Dockerfile              # Backend containerization
```

---

## 🚀 Execution Guide

### **Option 1: The Docker Way (Recommended)**
Running the entire stack with a single command.
```bash
# 1. Clone the repository
git clone https://github.com/mirza-shafi/Hospital_Management_Portal.git
cd Hospital_Management_Portal

# 2. Fire up the services
docker-compose up --build
```
*   **Frontend**: `http://localhost:3003`
*   **Backend**: `http://localhost:5000`

---

### **Option 2: The Local Way (Manual)**

#### **1. Backend Setup**
```bash
cd BACKEND
npm install
# Create .env (see below)
npm start # or 'npm run dev' for nodemon
```

#### **2. Frontend Setup**
```bash
cd FRONTEND
npm install
# Create .env (see below)
npm start
```

---

## ⚙️ Environment Configuration

Create `.env` files in their respective directories. **Never commit these to Git.**

**BACKEND/.env**
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_signing_key
```

**FRONTEND/.env**
```env
REACT_APP_API_URL=http://localhost:5000
```

---

## 👨‍💻 Author

**Mirza Shafi**  
*Lead Developer*

[![GitHub](https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/mirza-shafi)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://linkedin.com/in/mirza-shafi)

---

## 📄 License

This project is licensed under the MIT License.
