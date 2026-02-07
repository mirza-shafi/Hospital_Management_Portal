// frontend/src/App.js

import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bulma/css/bulma.min.css';
import { ThemeProvider } from './contexts/ThemeContext';
import { AdminThemeProvider } from './features/admin/context/AdminThemeContext';

// Shared components
import NavbarComponent from './features/shared/components/layout/Navbar';
import MainLayout from './features/shared/components/layout/MainLayout';
import ProtectedRoute from './features/shared/components/ProtectedRoute';
import Chatbot from './features/shared/components/utils/Chatbot';
import NewsTicker from './features/shared/components/utils/NewsTicker';
import SupportForm from './features/shared/components/forms/SupportForm';

// Pages
import Home from './pages/Home';
import About from './pages/About';

// Auth components
import DoctorSignUp from './features/auth/components/DoctorSignUp';
import PatientSignUp from './features/auth/components/PatientSignUp';
import DoctorLogin from './features/auth/components/DoctorLogin';
import PatientLogin from './features/auth/components/PatientLogin';
import AdminLogin from './features/auth/components/AdminLogin';

// Doctor components
// Doctor components
import DoctorDashboard from './features/doctor/components/DoctorDashboard';
import DoctorProfile from './features/doctor/components/DoctorProfile';
import DoctorDetails from './features/doctor/components/details/DoctorDetails';
import PrescriptionForm from './features/doctor/components/prescriptions/PrescriptionForm';
import PatientDetails from './features/patient/components/PatientDetails'; // Reusing for now
import ViewPrescription from './features/patient/components/prescriptions/ViewPrescription'; // Reusing
import AppointmentDetails from './features/clinic/components/AppointmentDetails'; // Reusing

// Doctor Layout & Context
import DoctorLayout from './features/doctor/components/layout/DoctorLayout';
import { DoctorThemeProvider } from './features/doctor/context/DoctorThemeContext';
import { Outlet } from 'react-router-dom';

// Patient components
import PatientAccount from './features/patient/components/PatientAccount';
import PatientProfile from './features/patient/components/PatientProfile';
// import PatientDetails from './features/patient/components/PatientDetails'; // Already imported above
import PatientPrescription from './features/patient/components/prescriptions/PatientPrescription';
// import ViewPrescription from './features/patient/components/prescriptions/ViewPrescription'; // Already imported above
import AppointmentForm from './features/patient/components/appointments/AppointmentForm';
import ViewAppointment from './features/patient/components/appointments/ViewAppointment';
import HealthCard from './features/patient/components/health/HealthCard';

// Clinic components
import BookWard from './features/clinic/components/BookWard';
import BookCabin from './features/clinic/components/BookCabin';
import AdmissionBill from './features/clinic/components/AdmissionBill';
import TestBill from './features/clinic/components/TestBill';
import TestService from './features/clinic/components/TestService';
// import AppointmentDetails from './features/clinic/components/AppointmentDetails'; // Already imported above

// Pharmacy components
import Pharmacy from './features/pharmacy/components/Pharmacy';
import BuyMedicine from './features/pharmacy/components/BuyMedicine';
import AddMedicine from './features/pharmacy/components/AddMedicine';
import MedicineDetails from './features/pharmacy/components/MedicineDetails';
import MedicineBill from './features/pharmacy/components/MedicineBill';
import Items from './features/pharmacy/components/Items';

// Blood Bank components
import BloodBank from './features/blood-bank/components/BloodBank';
import BloodDonor from './features/blood-bank/components/BloodDonor';
import BloodAvailability from './features/blood-bank/components/BloodAvailability';
import BloodGroupDetails from './features/blood-bank/components/BloodGroupDetails';
import BloodRecipient from './features/blood-bank/components/BloodRecipient';

// Admin components
import AdminDashboard from './features/admin/components/dashboard/AdminDashboard';
import AdminManageUsers from './features/admin/components/patients/AdminManageUsers';
import AdminManageDoctors from './features/admin/components/doctors/AdminManageDoctors';
import AdminManageAppointments from './features/admin/components/appointments/AdminManageAppointments';
import AdminReports from './features/admin/components/reports/AdminReports';
import AdminManageClinic from './features/admin/components/clinic/AdminManageClinic';
import AdminManageConsultations from './features/admin/components/consultations/AdminManageConsultations';
import AdminManageBlood from './features/admin/components/blood/AdminManageBlood';
import AdminManagePharmacy from './features/admin/components/pharmacy/AdminManagePharmacy';
import AdminManageEquipment from './features/admin/components/equipment/AdminManageEquipment';
import AdminManageFeedback from './features/admin/components/feedback/AdminManageFeedback';
import AdminSettings from './features/admin/components/settings/AdminSettings';
import AdminSupport from './features/admin/components/support/AdminSupport';
import AdminLayout from './features/admin/components/layout/AdminLayout';

function App() {
  return (
    <Router>
        <div className="App">
          <Routes>
            {/* Routes WITH Navbar - Wrapped in Public ThemeProvider */}
            <Route element={
              <ThemeProvider>
                <MainLayout />
              </ThemeProvider>
            }>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About/>} />
              <Route path="/blood-bank" element={<BloodBank />} />
              <Route path="/pharmacy" element={<Pharmacy />} />
              <Route path="/support" element={<SupportForm />} />
              <Route path="/doctor-signup" element={<DoctorSignUp />} />
              <Route path="/patient-signup" element={<PatientSignUp />} />
              <Route path="/doctor-login" element={<DoctorLogin />} />
              <Route path="/patient-login" element={<PatientLogin />} />

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

            {/* Protected Doctor Routes - New Layout (Outside MainLayout) */}
            {/* Protected Doctor Routes - New Layout (Outside MainLayout) */}
            <Route element={<ProtectedRoute type="doctor" />}>
                <Route element={
                    <DoctorThemeProvider>
                        <DoctorLayout>
                              <Outlet />
                        </DoctorLayout>
                    </DoctorThemeProvider>
                }>
                    <Route path="/doctor-account" element={<DoctorDashboard />} />
                    <Route path="/doctor-profile" element={<DoctorProfile />} />
                    <Route path="/doctor/appointments" element={<AppointmentDetails />} />
                    <Route path="/doctor/patients" element={<PatientDetails />} />
                    <Route path="/doctor/prescriptions" element={<ViewPrescription />} />
                    <Route path="/doctor/add-prescription" element={<PrescriptionForm />} />
                    {/* Legacy Routes */}
                    <Route path="/doctor-details" element={<DoctorDetails />} />
                    <Route path="/add-prescription" element={<PrescriptionForm/>} />
                    <Route path="/view-prescription" element={<ViewPrescription/>} />
                    <Route path="/view-appointment" element={<AppointmentDetails/>} />
                </Route>
            </Route>

            {/* Routes WITHOUT Navbar */}
            <Route path="/admin-login" element={<AdminLogin />} />

            {/* Admin Routes - Wrapped in AdminThemeProvider */}
            <Route element={
              <AdminThemeProvider>
                <ProtectedRoute type="admin" />
              </AdminThemeProvider>
            }>
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
                <Route path="/settings" element={<AdminSettings />} />
                <Route path="/admin-support" element={<AdminSupport />} />
            </Route>
          </Routes>
        </div>
      </Router>
  );
}

export default App;
