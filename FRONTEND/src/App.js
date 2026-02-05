// frontend/src/App.js

import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bulma/css/bulma.min.css';
import { ThemeProvider } from './contexts/ThemeContext';

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
import AdminManageDoctors from './components/AdminManageDoctors';
import AdminManageAppointments from './components/AdminManageAppointments';
import AdminReports from './components/AdminReports';
import AdminManageClinic from './components/AdminManageClinic';
import AdminManageConsultations from './components/AdminManageConsultations';
import AdminManageBlood from './components/AdminManageBlood';
import AdminManagePharmacy from './components/AdminManagePharmacy';
import AdminManageEquipment from './components/AdminManageEquipment';
import AdminManageFeedback from './components/AdminManageFeedback';
import AdminHelpCenter from './components/AdminHelpCenter';
import AdminSettings from './components/AdminSettings';
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

import MainLayout from './components/MainLayout';
import ProtectedRoute from './components/ProtectedRoute';
import AdminLayout from './components/AdminLayout';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <div className="App">
          <Routes>
            {/* Routes WITH Navbar */}
            <Route element={<MainLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About/>} />
              <Route path="/blood-bank" element={<BloodBank />} />
              <Route path="/support" element={<SupportForm />} />
              <Route path="/doctor-signup" element={<DoctorSignUp />} />
              <Route path="/patient-signup" element={<PatientSignUp />} />
              <Route path="/doctor-login" element={<DoctorLogin />} />
              <Route path="/patient-login" element={<PatientLogin />} />

              {/* Protected Doctor Routes */}
              <Route element={<ProtectedRoute type="doctor" />}>
                <Route path="/doctor-account" element={<DoctorAccount />} />
                <Route path="/doctor-profile" element={<DoctorProfile />} />
                <Route path="/doctor-details" element={<DoctorDetails />} />
                <Route path="/add-prescription" element={<PrescriptionForm/>} />
                <Route path="/view-prescription" element={<ViewPrescription/>} />
                <Route path="/view-appointment" element={<ViewAppointment/>} />
              </Route>

              {/* Protected Patient Routes */}
              <Route element={<ProtectedRoute type="patient" />}>
                <Route path="/patient" element={<PatientAccount />} />
                <Route path="/patient/profile" element={<PatientProfile />} />
                <Route path="/patient/prescription" element={<PatientPrescription />} />
                <Route path="/patient/details" element={<PatientDetails />} />
                <Route path="/patient/bookward" element={<BookWard/>} />
                <Route path="/patient/bookcabin" element={<BookCabin/>} />
                <Route path="/patient/healthcard" element={<HealthCard/>} />
                <Route path="/patient/admission-bill" element={<AdmissionBill/>} />
                <Route path="/patient/testbills" element={<TestBill/>} />
                <Route path="/patient/medicine-bill" element={<MedicineBill/>} />
                <Route path="/patient/pharmacy" element={<Pharmacy />} />
                <Route path="/patient/appointment" element={<AppointmentForm/>} />
                <Route path="/patient/appointment-details" element={<AppointmentDetails/>} />
              </Route>

              {/* Other Public Routes */}
              <Route path="/chat-bot" element={<Chatbot />} />
              <Route path="/news-ticker" element={<NewsTicker />} />
              <Route path="/blood-donor" element={<BloodDonor />} />
              <Route path="/blood-availability" element={<BloodAvailability />} />
              <Route path="/blood-group" element={<BloodGroupDetails />} />
              <Route path="/blood-recipient" element={<BloodRecipient />} />
            </Route>

            {/* Routes WITHOUT Navbar */}
            <Route path="/admin-login" element={<AdminLogin />} />

            <Route element={<ProtectedRoute type="admin" />}>
                <Route path="/admin-dashboard" element={<AdminDashboard />} />
                <Route path="/items" element={<Items />} />
                <Route path="/test-service" element={<TestService />} />
                <Route path="/add-medicine" element={<AddMedicine />} />
                <Route path="/medicine-details" element={<MedicineDetails />} />
                <Route path="/admin/patient-manage" element={<AdminManageUsers />} />
                <Route path="/admin/doctor-manage" element={<AdminManageDoctors />} />
                <Route path="/admin/appointment-manage" element={<AdminManageAppointments />} />
                <Route path="/admin/reports" element={<AdminReports />} />
                <Route path="/admin/clinic-manage" element={<AdminManageClinic />} />
                <Route path="/admin/consultation-manage" element={<AdminManageConsultations />} />
                <Route path="/admin/blood-manage" element={<AdminManageBlood />} />
                <Route path="/admin/pharmacy-manage" element={<AdminManagePharmacy />} />
                <Route path="/admin/equipment-manage" element={<AdminManageEquipment />} />
                <Route path="/feedback" element={<AdminManageFeedback />} />
                <Route path="/help" element={<AdminHelpCenter />} />
                <Route path="/settings" element={<AdminSettings />} />
                <Route path="/admin-support" element={<AdminSupport />} />
            </Route>
          </Routes>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
