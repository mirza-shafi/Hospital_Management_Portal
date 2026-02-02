# 🏥 Healing Wave — Hospital Management Portal

[![MERN Stack](https://img.shields.io/badge/Stack-MERN-blue.svg)](https://mongodb.com)
[![Docker](https://img.shields.io/badge/Deployment-Docker-blue.svg)](https://docker.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A sophisticated, full-stack medical ecosystem designed to bridge the gap between healthcare providers and patients. **Healing Wave** combines a **"Dark Premium" Glassmorphism** aesthetic with robust administrative tools, real-time AI assistance, and seamless resource management.

---

## ✨ Key Highlights

- **🎨 Premium UI/UX**: A modern, glassmorphic design language featuring a refined **Dark Mode**, vibrant gradients, and smooth micro-animations. Fully responsive across desktop, tablet, and mobile devices.
- **🤖 AI Health Bot**: Integrated intelligent chatbot for instant patient guidance and triage.
- **🩸 Advanced Blood Bank**: Comprehensive system for managing donors, blood availability, and finding compatible blood groups.
- **🔐 Multi-Role Access**: Dedicated, secure portals for **Admins**, **Doctors**, and **Patients** with JWT-based authorization.
- **💊 Pharmacy & Inventory**: Centralized management of medicine stocks and pharmacy operations.
- **📊 Advanced Analytics**: Premium data visualization for appointments and patient demographics using **Chart.js**.

---

## 🚀 Recent Enhancements

### **💎 Dark Premium Re-imagined**
The entire portal has been upgraded with a **"Dark Premium"** design language:
- **Glassmorphism**: Sophisticated use of blur, transparency, and subtle borders.
- **Iconography**: Integrated **React Icons (Fa)** for higher information density and visual clarity.
- **Patient Details**: Completely redesigned patient cards with grouped personal/clinical data and expressive iconography.
- **Enhanced Search**: Modernized search bars with focus-state animations and integrated search buttons.

### **📈 Data & Analytics**
- **Appointments Chart**: Donut-style visualization with center-text summaries for quick insights.
- **Patients Chart**: Robust bar-chart tracking of patient volume.
- **Consistency**: High-fidelity dark mode support for all charts and modals.

---

## 🌟 Features Overview

### **1. Blood Bank Management**
A dedicated module designed for efficiency and ease of use:
- **Donate Blood**: Streamlined registration for donors.
- **Find Blood**: Quick search for blood recipients.
- **Availability Check**: Real-time view of blood stock availability.
- **Donor Compatibility**: Detailed views for finding compatible donors.
- **Theming**: Consistent glassmorphism design with seamless dark mode support.

### **2. Admin Portal**
Powerful tools for hospital administrators:
- **Dashboard**: Overview of hospital stats and quick actions.
- **User Management**: Control access for doctors and staff.
- **Inventory Control**: Manage medicines and hospital resources.
- **Mobile Optimized**: Fully refined mobile layout for on-the-go management.

### **3. Patient & Doctor Portals**
- **Appointment Booking**: Easy scheduling system.
- **Medical History**: Secure access to patient records.
- **Prescriptions**: Digital prescription management.

---

## 🏗️ Project Architecture

### **📁 FRONTEND (React.js)**
```text
FRONTEND/
├── public/                 # Static assets & index.html
├── src/
│   ├── api/                # API configurations & axios interceptors
│   ├── assets/             # Branding, icons, and premium UI images
│   ├── components/         # Core UI: Admin, Doctor, Patient, Blood Bank
│   │   ├── styles/         # Module-specific "Dark Premium" CSS
│   │   └── Chatbot.js      # AI Triage & Help Assistant
│   ├── contexts/           # Theme & Auth state management
│   ├── services/           # Business logic & API abstraction
│   ├── App.js              # Routing & Layout orchestration
│   └── main.jsx            # Application entry point
├── Dockerfile              # Frontend containerization
└── package.json            # Dependencies & Scripts
```

### **🔙 BACKEND (Node.js/Express)**
```text
BACKEND/
├── config/                 # DB & Environment configurations
├── middleware/             # Auth, Validation & Error Handlers
├── models/                 # Mongoose Schemas (User, Appt, Medicine, BloodBank)
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
*   **Backend**: `http://localhost:8000`

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
PORT=5001
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_signing_key
```

**FRONTEND/.env**
```env
REACT_APP_API_URL=http://localhost:5001
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
