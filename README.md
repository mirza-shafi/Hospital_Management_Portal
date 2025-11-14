# 🏥 Hospital Management Portal

A full-stack MERN application designed to streamline hospital operations with secure authentication, patient and appointment management, chatbot assistance, and a modern user interface.

---

## 🚀 Features
- Secure user authentication (JWT)
- Role-based access (Admin, Doctor, Patient)
- Patient management (Add, Update, Delete, View)
- Appointment scheduling system
- User profile management
- Integrated chatbot
- Responsive & modern UI

---

## 🛠️ Tech Stack

Frontend:
- React.js
- Tailwind CSS
- Axios

Backend:
- Node.js
- Express.js
- MongoDB (Mongoose)

Others:
- JWT Authentication
- bcrypt Password Hashing

---

## ⚙️ Installation & Setup

1️⃣ Clone Repository:
git clone https://github.com/mirza-shafi/Hospital_Management_Portal.git
cd Hospital_Management_Portal

---

## 🖥️ Backend Setup

Enter backend folder:
cd BACKEND

Install dependencies:
npm install

Create .env file:
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret_key

Start backend:
npm start

Backend runs at:
http://localhost:5000

---

## 🎨 Frontend Setup

Enter frontend folder:
cd FRONTEND

Install dependencies:
npm install

Start frontend:
npm start

Frontend runs at:
http://localhost:3000

---

## 🏃 Run Full Project

Terminal 1 — Backend:
cd BACKEND
npm start

Terminal 2 — Frontend:
cd FRONTEND
npm start

---

## 🔌 API Endpoints Summary

Authentication:
POST /api/auth/register
POST /api/auth/login

User:
GET /api/users/me
PUT /api/users/update

Patients:
POST /api/patients/add
GET /api/patients/all
PUT /api/patients/update/:id
DELETE /api/patients/delete/:id

Appointments:
POST /api/appointments/create
GET /api/appointments/user
DELETE /api/appointments/:id

---

## 📅 Future Enhancements
- Analytics dashboard
- Doctor availability tracking
- Prescription & billing system
- AI-powered triage chatbot

---

## 👨‍💻 Author
Mirza Shafi
GitHub: https://github.com/mirza-shafi
LinkedIn: https://linkedin.com/in/mirza-shafi
