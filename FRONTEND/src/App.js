// frontend/src/App.js

import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bulma/css/bulma.min.css';

import NavbarComponent from './components/Navbar';
import Home from './components/Home';
import DoctorSignUp from './components/DoctorSignUp';
import PatientSignUp from './components/PatientSignUp';
import DoctorLogin from './components/DoctorLogin';
import PatientLogin from './components/PatientLogin';
import DoctorAccount from './components/DoctorAccount';
import PatientAccount from './components/PatientAccount';
import DoctorProfile from './components/DoctorProfile';
import PatientProfile from './components/PatientProfile';
import DoctorDetails from './components/DoctorDetails';
import PatientDetails from './components/PatientDetails';
import PrescriptionForm from './components/PrescriptionForm';
import About from './components/About';
import ViewPrescription from './components/ViewPrescription';
import PatientPrescription from './components/PatientPrescription';
import BookWard from './components/BookWard';
import BookCabin from './components/BookCabin';
import HealthCard from './components/HealthCard';
import AdmissionBill from './components/AdmissionBill';
import TestBill from './components/TestBill';
import MedicineBill from './components/MedicineBill';
import Items from './components/Items';
import TestService from './components/TestService';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';
import AdminManageUsers from './components/AdminManageUsers';
import AddMedicine from './components/AddMedicine';
import MedicineDetails from './components/MedicineDetails';
import Pharmacy from './components/Pharmacy';
import BuyMedicine from './components/BuyMedicine';
import Chatbot from './components/Chatbot';
import BloodBank from './components/BloodBank';
import BloodDonor from './components/BloodDonor';
import BloodAvailability from './components/BloodAvailability';
import BloodGroupDetails from './components/BloodGroupDetails';
import BloodRecipient from './components/BloodRecipient';
import AppointmentForm from './components/AppointmentForm';
import AppointmentDetails from './components/AppointmentDetails';
import ViewAppointment from './components/ViewAppointment';
import NewsTicker from './components/NewsTicker';
import SupportForm from './components/SupportForm';
import AdminSupport from './components/AdminSupport';

function App() {
  return (
    <Router>
      <div className="App">
        <NavbarComponent />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/doctor-signup" element={<DoctorSignUp />} />
          <Route path="/patient-signup" element={<PatientSignUp />} />
          <Route path="/doctor-login" element={<DoctorLogin />} />
          <Route path="/patient-login" element={<PatientLogin />} />
          <Route path="/doctor-account" element={<DoctorAccount />} />
          <Route path="/patient-account" element={<PatientAccount />} />
          <Route path="/doctor-profile" element={<DoctorProfile />} />
          <Route path="/patient-profile" element={<PatientProfile />} />
          <Route path="/doctor-details" element={<DoctorDetails />} />
          <Route path="/patient-details" element={<PatientDetails />} />
          <Route path="/add-prescription" element={<PrescriptionForm/>} />
          <Route path="/view-prescription" element={<ViewPrescription/>} />
          <Route path="/patient-prescription" element={<PatientPrescription/>} />
          <Route path="/about" element={<About/>} />
          <Route path="/book-ward" element={<BookWard/>} />
          <Route path="/book-cabin" element={<BookCabin/>} />
          <Route path="/health-card" element={<HealthCard/>} />
         <Route path="/admission-bill" element={<AdmissionBill/>} />
         <Route path="/test-bill" element={<TestBill/>} />
         <Route path="/items" element={<Items/>} />
         <Route path="/test-service" element={<TestService/>} />
         <Route path="/admin-login" element={<AdminLogin/>} />
         <Route path="/admin-dashboard" element={<AdminDashboard/>} />
         <Route path="/add-medicine" element={<AddMedicine/>} />
         <Route path="/medicine-details" element={<MedicineDetails/>} />
         <Route path="/pharmacy" element={<Pharmacy/>} />
         <Route path="/buy-medicine" element={<BuyMedicine/>} />
         <Route path="/medicine-bill" element={<MedicineBill/>} />
         <Route path="/chat-bot" element={<Chatbot/>} />
         <Route path="/blood-bank" element={<BloodBank/>} />
         <Route path="/blood-donor" element={<BloodDonor/>} />
         <Route path="/blood-availability" element={<BloodAvailability/>} />
         <Route path="/blood-group" element={<BloodGroupDetails/>} />
         <Route path="/blood-recipient" element={<BloodRecipient/>} />
         <Route path="/appointment-form" element={<AppointmentForm/>} />
         <Route path="/appointment-details" element={<AppointmentDetails/>} />
         <Route path="/view-appointment" element={<ViewAppointment/>} />
         <Route path="/admin-manage-users" element={<AdminManageUsers/>} />
         <Route path="/news-ticker" element={<NewsTicker/>} />
         <Route path="/support" element={<SupportForm/>} />
         <Route path="/admin-support" element={<AdminSupport/>} />

         
    
        </Routes>
      </div>
    </Router>
  );
}

export default App;
