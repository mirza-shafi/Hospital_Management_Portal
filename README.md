# 🏥 Hospital Management Portal

<div align="center">

[![MERN Stack](https://img.shields.io/badge/Stack-MERN-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://mongodb.com)
[![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://docker.com)
[![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://mongodb.com)
[![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com)
[![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org)

**A comprehensive, full-stack hospital management system with a RAG-powered AI assistant, blood bank management, online pharmacy, and a clean, modern medical UI**

[Features](#-features) • [Tech Stack](#-tech-stack) • [Installation](#-quick-start) • [Architecture](#-architecture) • [API Documentation](#-api-endpoints) • [Contributing](#-contributing)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Quick Start](#-quick-start)
- [Architecture](#-architecture)
- [API Endpoints](#-api-endpoints)
- [Environment Variables](#-environment-variables)
- [Screenshots](#-screenshots)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🌟 Overview

**Hospital Management Portal** is an enterprise-grade medical ecosystem designed to streamline hospital operations and enhance patient care. Built with the MERN stack, it provides comprehensive tools for managing appointments, patient records, blood bank operations, pharmacy inventory, and billing systems.

### **Why This Project?**

- 🎯 **Real-world Solution**: Addresses actual challenges in healthcare management
- 💡 **Modern Tech**: Built with industry-standard MERN stack and Docker
- 🔒 **Security First**: JWT authentication, role-based access control, and secure data handling
- 🎨 **Clean UX**: Modern white/neutral medical design with responsive layouts
- 🚀 **Production Ready**: Dockerized for easy deployment and scaling

---

## ✨ Features

### **🔐 Multi-Role Authentication System**
- **Admin Portal**: Complete hospital oversight with analytics dashboard
- **Doctor Portal**: Patient management, prescriptions, and appointment handling
- **Patient Portal**: Book appointments, view medical history, access health cards
- JWT-based secure authentication with role-based access control

### **🩺 Patient Management**
- Complete patient registration with medical history
- Digital health card generation and management
- Appointment booking and scheduling system
- Prescription and medical record access
- Test and service bill tracking

### **👨‍⚕️ Doctor Management**
- Doctor registration with specialization and credentials
- Profile management with photo upload
- Patient appointment management
- Digital prescription generation
- Schedule and availability management

### **💉 Advanced Blood Bank System**
- Blood donor registration and management
- Blood recipient tracking
- Real-time blood availability monitoring by blood group
- Donor-recipient matching system
- Blood group compatibility checking

### **💊 Pharmacy & Inventory**
- Medicine catalog with image uploads
- Stock management and tracking
- Medicine bill generation
- Purchase history and records
- Low stock alerts

### **🏥 Ward & Cabin Management**
- Ward booking system
- Cabin reservation and management
- Bed availability tracking
- Admission and discharge management

### **💰 Billing System**
- Automated medicine bill generation
- Test and services billing
- Comprehensive bill history
- PDF bill download and printing

### **🤖 AI Health Assistant (RAG)**
- Answers grounded in the portal's own live data (doctors, blood stock, medicines)
- Semantic vector search with parent–child retrieval (see the AI Assistant section)
- Robust sentence-level chunking — handles medical abbreviations (`Dr.`, `M.D.`), decimal prices (`BDT 50.50`), and email addresses without fragmentation
- Race-condition-safe debounced index rebuild — no admin edit is ever silently dropped
- Conversation state persists across in-app navigation without `localStorage` or `sessionStorage`
- Clickable in-app links and 24/7 availability

### **📊 Analytics & Reporting**
- Appointment statistics with Chart.js visualizations
- Patient demographics and trends
- Doctor performance metrics
- Revenue and billing analytics

### **🎨 Clean, Modern UI/UX**
- Clean white/neutral medical design language (Mayo Clinic / Cleveland Clinic inspired)
- Fully responsive across all devices
- Subtle, professional transitions
- Intuitive navigation and workflows
- Modern iconography with React Icons

---

## 🛠️ Tech Stack

### **Frontend**
```
⚛️  React.js 18.3.1        - UI library
🎨  CSS3 + Tailwind CSS    - Styling
📊  Chart.js               - Data visualization
🎭  React Icons            - Icon library
🔄  Axios                  - HTTP client
🧭  React Router v6        - Routing
📄  jsPDF & html2canvas    - PDF generation
```

### **Backend**
```
🟢  Node.js                - Runtime environment
⚡  Express.js 4.19        - Web framework
🍃  MongoDB + Mongoose     - Database & ODM
🔐  JWT + bcrypt.js        - Authentication
✉️  Nodemailer            - Email service
📝  Express Validator      - Input validation
🛡️  Helmet                - Security headers
📤  Multer                 - File uploads
```

### **DevOps**
```
🐳  Docker                 - Containerization
📦  Docker Compose         - Multi-container orchestration
🔧  Nodemon                - Development auto-reload
```

---

## 🚀 Quick Start

### **Prerequisites**
- Node.js v16+ and npm
- MongoDB (local or Atlas)
- Docker & Docker Compose (optional)

### **Option 1: Docker Deployment (Recommended)**

```bash
# Clone the repository
git clone https://github.com/mirza-shafi/Hospital_Management_Portal.git
cd Hospital_Management_Portal

# Start all services with Docker Compose
docker-compose up --build

# Access the application
# Frontend: http://localhost:1001
# Backend API: http://localhost:1002
```

### **Option 2: Manual Installation**

#### **Backend Setup**
```bash
# Navigate to backend directory
cd BACKEND

# Install dependencies
npm install

# Create .env file (see Environment Variables section)
touch .env

# Start the server
npm start        # Production
npm run dev      # Development with nodemon
```

#### **Frontend Setup**
```bash
# Navigate to frontend directory
cd FRONTEND

# Install dependencies
npm install

# Create .env file (see Environment Variables section)
touch .env

# Start the development server
npm start

# Build for production
npm run build
```

---

## 🏗️ Architecture

### **Project Structure**
```
Hospital_Management_Portal/
│
├── BACKEND/                      # Node.js/Express backend
│   ├── config/                   # Database and environment configurations
│   │   └── database.js
│   ├── middleware/               # Custom middleware
│   │   ├── auth.js              # JWT authentication
│   │   ├── authMiddleware.js
│   │   ├── errorHandler.js      # Global error handling
│   │   ├── registrationValidator.js
│   │   └── validator.js
│   ├── models/                   # Mongoose schemas
│   │   ├── Admin.js
│   │   ├── Doctor.js
│   │   ├── Patient.js
│   │   ├── Appointment.js
│   │   ├── BloodDonor.js
│   │   ├── BloodRecipient.js
│   │   ├── BloodAvailability.js
│   │   ├── Medicine.js
│   │   ├── MedicineBill.js
│   │   ├── Prescription.js
│   │   ├── HealthCard.js
│   │   ├── TestOrService.js
│   │   ├── TestAndServicesBill.js
│   │   ├── wardBook.js
│   │   ├── cabinBook.js
│   │   ├── Chatbot.js
│   │   ├── Support.js
│   │   └── About.js
│   ├── routes/                   # API endpoints
│   │   ├── admin.js
│   │   ├── doctors.js
│   │   ├── patients.js
│   │   ├── appointments.js
│   │   ├── bloodDonor.js
│   │   ├── bloodRecipient.js
│   │   ├── bloodAvailability.js
│   │   ├── medicines.js
│   │   ├── medicineBill.js
│   │   ├── prescriptions.js
│   │   ├── healthcards.js
│   │   ├── testOrService.js
│   │   ├── testAndServicesBill.js
│   │   ├── wardBooking.js
│   │   ├── cabinBooking.js
│   │   ├── chatbot.js
│   │   ├── support.js
│   │   └── about.js
│   ├── scripts/                  # Utility scripts
│   │   ├── initAboutData.js
│   │   ├── seedDoctors.js        # seed 10 sample doctors
│   │   ├── seedMedicines.js      # seed 25 sample medicines
│   │   ├── seedBlood.js          # seed blood stock + donors
│   │   ├── buildEmbeddings.js    # build the RAG vector index
│   │   ├── testConnection.js
│   │   └── testDB.js
│   ├── uploads/                  # File storage
│   │   ├── doctors/
│   │   └── medicines/
│   ├── index.js                  # Express app entry point
│   ├── dbconnect.js             # MongoDB connection
│   ├── package.json
│   └── Dockerfile
│
├── FRONTEND/                     # React.js frontend
│   ├── public/
│   │   ├── index.html
│   │   ├── manifest.json
│   │   └── robots.txt
│   ├── src/
│   │   ├── api/                 # API configuration
│   │   │   └── config.js
│   │   ├── assets/              # Images, logos, icons
│   │   ├── components/          # React components
│   │   │   ├── Admin/           # Admin dashboard components
│   │   │   ├── Doctor/          # Doctor portal components
│   │   │   ├── Patient/         # Patient portal components
│   │   │   ├── BloodBank/       # Blood bank components
│   │   │   ├── Pharmacy/        # Pharmacy components
│   │   │   ├── Common/          # Shared components
│   │   │   ├── Home.js
│   │   │   ├── Navbar.js
│   │   │   ├── Footer.js
│   │   │   └── Chatbot.js
│   │   ├── contexts/            # React context providers
│   │   ├── services/            # API service functions
│   │   ├── App.js               # Main app component
│   │   ├── index.js             # React entry point
│   │   └── index.css
│   ├── package.json
│   ├── tailwind.config.js
│   └── Dockerfile
│
├── docker-compose.yml            # Docker orchestration
└── README.md
```

### **System Flow**
```
User (Browser)
     ↓
React Frontend (Port 1001)
     ↓
Express.js API (Port 1002)
     ↓
MongoDB Database
```

---

## 🤖 AI Assistant (RAG)

HealingWave includes an AI assistant that answers questions about doctors,
appointments, blood availability, medicines, and how to use the portal. It is
grounded in the application's **own live data** using a modern
Retrieval-Augmented Generation (RAG) pipeline with **semantic vector search**
and **parent–child retrieval**.

### How it works

**A. Indexing (offline / on data change)** — build the searchable knowledge base:

```mermaid
flowchart LR
    DB[("🗄️ MongoDB live data<br/>doctors · blood · medicines")] --> P["📄 Build parent docs<br/>(+ static portal pages)"]
    P --> C["✂️ Split into small<br/>child chunks"]
    C --> E["🔢 Embed each child<br/>MiniLM · 384-dim"]
    E --> V[("📦 KnowledgeChunk store<br/>+ Atlas vector_index")]
```

**B. Answering a question (live)** — retrieve, then generate:

```mermaid
flowchart TD
    Q(["👤 User question"]) --> EMB["🔢 Embed the query<br/>MiniLM · 384-dim"]
    EMB --> R{"🔎 Find matching<br/>child chunks"}
    R -->|primary| VS["🟢 Atlas $vectorSearch"]
    R -->|fallback 1| COS["🟡 In-app cosine"]
    R -->|fallback 2| KW["🟠 Keyword match"]
    VS --> PAR["👪 Parent expansion<br/>child hits → parent docs (top-K)"]
    COS --> PAR
    KW --> PAR
    PAR --> PR["🧩 Build prompt<br/>context + safety guardrails"]
    PR --> LLM["🤖 LLM generation<br/>Llama-3.1-8B-Instruct"]
    LLM --> ANS(["💬 Answer with clickable in-app links"])
    LLM -.->|LLM unavailable| RB["🛟 Rule-based fallback reply"]
    RB --> ANS
```

**In plain steps:**

1. **You ask** a question in the chat widget.
2. The question is turned into a **384-number vector** (embedding) that captures its meaning.
3. The system **searches** the stored knowledge for the closest child chunks — using Atlas Vector Search, or cosine, or keywords if needed.
4. Each match is **expanded to its full parent document** (e.g. the complete doctor or medicine record) for richer context.
5. That context + **safety rules** are sent to the **LLM**, which writes a short, grounded answer with clickable page links.
6. If the LLM is ever unreachable, a built-in **rule-based reply** is used instead — so the assistant never breaks.

### Implementation details

- **Knowledge base** (`BACKEND/services/ragChatbot.js → buildKnowledgeBase`):
  built from live collections — every **doctor** (name, specialty, department,
  availability), live **blood stock** per group, and all **medicines** (generic
  name, price, manufacturer) — plus static documents for services, appointments,
  blood bank, pharmacy, health card, and support.
- **Parent–child chunking** (`chunkParent`): each parent document is split into
  small sentence-level **child chunks** (title-prefixed for recall). Children are
  matched at query time; the larger **parent** document is returned as context.
  The splitter uses negative-lookbehind regex to correctly preserve medical
  abbreviations (`Dr.`, `M.D.`, `MBBS`, `FCPS`), decimal prices (`BDT 50.50`),
  and email addresses (`info@healingwave.com`) without fragmenting them into
  broken sub-chunks.
- **Embeddings** (`BACKEND/services/embeddings.js`): child chunks and the query
  are embedded with **`sentence-transformers/all-MiniLM-L6-v2`** (384-dim) via the
  Hugging Face hosted feature-extraction endpoint.
- **Persistent vector store** (`KnowledgeChunk` collection): embeddings are
  stored in MongoDB and reused across requests. A content hash (`buildHash`)
  rebuilds the index only when the underlying data changes. Build/refresh with
  `node scripts/buildEmbeddings.js`.
- **Live totals**: aggregate questions ("how many doctors / medicines / blood
  units?") are answered from real-time `countDocuments`/aggregation injected into
  the context on every request, so totals are always exact and never stale.
- **Automatic refresh**: whenever an admin adds, edits, or deletes a **doctor**,
  **medicine**, or **blood group**, the affected route calls a debounced
  background rebuild (`scheduleRebuild` in `ragChatbot.js`). The write returns
  instantly and the embedding index is re-embedded a couple of seconds later —
  so the assistant learns about new data with no user-facing lag and no manual
  step. The debouncer uses a `rebuildPending` flag so rapid concurrent writes
  during an active rebuild are queued and never silently dropped.
- **Stable content hashing** (`hashParents`): the SHA-1 hash that decides
  whether to rebuild is computed over a **sorted** copy of the parent array,
  making it deterministic regardless of MongoDB document return order and
  eliminating false-positive full-index rebuilds.
- **Persistent chat state** (`ChatContext`): the conversation history lives in
  a React Context mounted above the router, so switching pages does not reset
  the chat. A hard browser refresh starts a fresh conversation (no
  `localStorage` or `sessionStorage` is used).
- **Retrieval** (`vectorRetrieve`): query embedding → **Atlas `$vectorSearch`**
  (cosine, index `vector_index` on `embedding`, 384 dims) → child hits grouped
  into unique parents → top-K parents. If the Atlas index is unavailable it
  falls back to **in-app cosine similarity** over the stored embeddings, and if
  embeddings are unavailable entirely it falls back to **lexical keyword**
  retrieval.
- **Generation** (`askLLM`): retrieved parent snippets are injected into a system
  prompt with guardrails — answer only from context, never invent
  doctor/price/stock data, always link pages as `[Label](/path)`, and never
  provide a diagnosis (advise consulting a doctor). Calls the Hugging Face
  OpenAI-compatible router endpoint.
- **Fallback**: if the LLM call fails (network/rate-limit), the endpoint serves
  the original rule-based responses, so the assistant never breaks. Every
  interaction is persisted to the `Chatbot` collection.
- **Frontend** (`Chatbot.js`): renders Markdown links as clickable in-app
  navigation, shows a typing indicator, and sends recent conversation history
  for context.

### Configuration

Set these in `BACKEND/.env` (read at runtime; the `.env` file is git-ignored):

```env
HF_API_TOKEN=your_hugging_face_access_token   # https://huggingface.co/settings/tokens
HF_MODEL=meta-llama/Llama-3.1-8B-Instruct
HF_EMBED_MODEL=sentence-transformers/all-MiniLM-L6-v2
ATLAS_VECTOR_INDEX=vector_index
```

Then build the embedding index once (and after seeding new data):

```bash
cd BACKEND
node scripts/buildEmbeddings.js
```

> Note: this uses a **Hugging Face** inference token (prefix `hf_`), not Google
> Gemini. The Atlas Vector Search index (`vector_index`, vector field
> `embedding`, 384 dims, cosine) is created on the `knowledgechunks` collection.

### Capabilities

| Capability | Status |
| --- | --- |
| DB-grounded retrieval + LLM generation | ✅ Implemented |
| Vector / embedding semantic search (MiniLM, 384-dim) | ✅ Implemented |
| Parent–child chunk retrieval | ✅ Implemented |
| Persistent vector store (`KnowledgeChunk`) | ✅ Implemented |
| Atlas `$vectorSearch` index | ✅ Implemented |
| Cosine + keyword fallbacks | ✅ Implemented |
| Live aggregate totals (exact counts) | ✅ Implemented |
| Auto-refresh on admin add/edit/delete | ✅ Implemented |
| Rule-based fallback when LLM is unavailable | ✅ Implemented |
| Medical-safe sentence splitter (decimals, abbreviations, emails) | ✅ Implemented |
| Race-condition-safe rebuild debouncer (`rebuildPending` flag) | ✅ Implemented |
| Stable order-independent content hash (`hashParents`) | ✅ Implemented |
| Cross-route chat persistence (React Context, memory-only) | ✅ Implemented |

---

## 🔌 API Endpoints

### **Authentication**
```
POST   /api/admin/login          - Admin login
POST   /api/doctors/login         - Doctor login
POST   /api/patients/login        - Patient login
POST   /api/doctors/register      - Doctor registration
POST   /api/patients/register     - Patient registration
```

### **Patient Management**
```
GET    /api/patients              - Get all patients
GET    /api/patients/:id          - Get patient by ID
PUT    /api/patients/:id          - Update patient
DELETE /api/patients/:id          - Delete patient
```

### **Doctor Management**
```
GET    /api/doctors               - Get all doctors
GET    /api/doctors/:id           - Get doctor by ID
PUT    /api/doctors/:id           - Update doctor profile
POST   /api/doctors/upload        - Upload doctor photo
```

### **Appointments**
```
GET    /api/appointments          - Get all appointments
POST   /api/appointments          - Create appointment
PUT    /api/appointments/:id      - Update appointment
DELETE /api/appointments/:id      - Delete appointment
```

### **Blood Bank**
```
GET    /api/bloodDonor            - Get all donors
POST   /api/bloodDonor            - Register donor
GET    /api/bloodRecipient        - Get all recipients
POST   /api/bloodRecipient        - Register recipient
GET    /api/bloodAvailability     - Get blood availability
PUT    /api/bloodAvailability/:id - Update blood stock
```

### **Pharmacy**
```
GET    /api/medicines             - Get all medicines
POST   /api/medicines             - Add medicine
PUT    /api/medicines/:id         - Update medicine
DELETE /api/medicines/:id         - Delete medicine
POST   /api/medicineBill          - Generate medicine bill
GET    /api/medicineBill/:id      - Get bill details
```

### **Prescriptions**
```
GET    /api/prescriptions         - Get all prescriptions
POST   /api/prescriptions         - Create prescription
GET    /api/prescriptions/:id     - Get prescription by ID
```

### **Ward & Cabin Booking**
```
GET    /api/wardBooking           - Get ward bookings
POST   /api/wardBooking           - Book ward
GET    /api/cabinBooking          - Get cabin bookings
POST   /api/cabinBooking          - Book cabin
```

---

## ⚙️ Environment Variables

### **Backend (.env)**
```env
# Server Configuration
PORT=1002
NODE_ENV=development

# Database
MONIT_URI=mongodb://localhost:27017/hospital_db
# OR for MongoDB Atlas
# MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/hospital_db

# Authentication
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRE=7d

# Email Configuration (for notifications)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password

# File Upload
MAX_FILE_SIZE=5000000
UPLOAD_PATH=./uploads
```

### **Frontend (.env)**
```env
# API Configuration
REACT_APP_API_URL=http://localhost:1002

# Optional: Google Maps API (if used)
# REACT_APP_GOOGLE_MAPS_KEY=your_google_maps_api_key
```

### **Docker Environment**
```env
# docker-compose.yml environment variables
MONGODB_URI=mongodb://mongo:27017/hospital_db
FRONTEND_PORT=1001
BACKEND_PORT=1002
```

---

## 📸 Screenshots

> Add screenshots of your application here to showcase the UI

---

## 📋 Changelog

### v1.1.0 — RAG Pipeline Hardening & Chat Persistence

**Backend — `BACKEND/services/ragChatbot.js`**

- **Fix: Race condition in `scheduleRebuild`** — Previously, if an admin edit
  triggered a rebuild while one was already running, the second request was
  silently dropped and the vector index stayed out of sync. Added a
  `rebuildPending` boolean flag: concurrent requests are queued and executed
  immediately once the active rebuild completes.

- **Fix: Order-sensitive `hashParents`** — The SHA-1 content hash was computed
  in MongoDB's unpredictable document return order, causing false-positive full
  rebuilds when nothing had changed. Parents are now sorted by `id` before
  hashing, making the hash deterministic.

- **Fix: Broken sentence splitter in `chunkParent`** — The previous regex
  `/[^.!?]+[.!?]+|\S[^.!?]*$/g` split on every literal `.`, producing broken
  fragments from medical data (`"Dr."` → `["Dr.", "John..."]`,
  `"BDT 50.50"` → `["BDT 50.", "50."]`,
  `"info@healingwave.com"` → `["info@healingwave.", "com."]`).
  Replaced with a negative-lookbehind split that correctly preserves decimal
  prices, physician titles (`Dr.`, `Mr.`, `Ms.`), medical qualifications
  (`M.D.`, `MBBS`, `FCPS`, `B.Sc.`), and email addresses. Verified against
  7 real data cases — all pass.

**Frontend — Chat Persistence**

- **New: `ChatContext.js`** — Created a `ChatProvider` + `useChat()` hook that
  holds the conversation `messages` array in React memory at the app root level.
  Conversation state now survives in-app route changes. A hard browser refresh
  resets to the greeting (no `localStorage` or `sessionStorage` used).

- **Modified: `App.js`** — Wrapped the `<Router>` with `<ChatProvider>` so
  chat state lives above all route renders.

- **Modified: `Chatbot.js`** — Replaced local `useState([greeting])` with
  `const { messages, setMessages } = useChat()`. Local `input` and `typing`
  state remain unchanged.

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/AmazingFeature
   ```
3. **Commit your changes**
   ```bash
   git commit -m 'Add some AmazingFeature'
   ```
4. **Push to the branch**
   ```bash
   git push origin feature/AmazingFeature
   ```
5. **Open a Pull Request**

### **Coding Standards**
- Follow ESLint configuration
- Write meaningful commit messages
- Add comments for complex logic
- Update documentation for new features

---

## 🐛 Known Issues & Roadmap

### **Known Issues**
- [ ] Email notification system needs SMTP configuration
- [ ] File upload size limits need environment-based configuration

### **Future Enhancements**
- [ ] SMS notification integration
- [ ] Video consultation feature
- [ ] Mobile app (React Native)
- [ ] Advanced reporting with PDF exports
- [ ] Multi-language support
- [ ] Real-time notifications with WebSockets
- [ ] Integration with medical devices
- [ ] Telemedicine capabilities

---

## 📝 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Mirza Shafi**

[![GitHub](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/mirza-shafi)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://linkedin.com/in/mirza-shafi)

---

## 🙏 Acknowledgments

- Thanks to all contributors who helped improve this project
- Inspired by real-world hospital management challenges
- Built with love for the healthcare community

---

<div align="center">

**⭐ Star this repository if you find it helpful!**

Made with ❤️ by [Mirza Shafi](https://github.com/mirza-shafi)

</div>
