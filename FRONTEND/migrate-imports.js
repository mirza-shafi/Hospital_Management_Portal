#!/usr/bin/env node

/**
 * Import Path Migration Script
 * Automatically updates all import statements to match new feature-based structure
 */

const fs = require('fs');
const path = require('path');

// Import mapping: old path → new path
const importMappings = {
  // Admin components
  './AdminLayout': '@/features/admin/components/layout/AdminLayout',
  '../components/AdminLayout': '@/features/admin/components/layout/AdminLayout',
  './components/AdminLayout': '@/features/admin/components/layout/AdminLayout',
  
  './AdminDashboard': '@/features/admin/components/dashboard/AdminDashboard',
  '../components/AdminDashboard': '@/features/admin/components/dashboard/AdminDashboard',
  
  './AdminManageUsers': '@/features/admin/components/patients/AdminManageUsers',
  './PatientDetailsSheet': '@/features/admin/components/patients/PatientDetailsSheet',
  '../components/PatientDetailsSheet': '@/features/admin/components/patients/PatientDetailsSheet',
  
  './AdminManageDoctors': '@/features/admin/components/doctors/AdminManageDoctors',
  './DoctorDetailsSheet': '@/features/admin/components/doctors/DoctorDetailsSheet',
  '../components/DoctorDetailsSheet': '@/features/admin/components/doctors/DoctorDetailsSheet',
  
  './AdminManageAppointments': '@/features/admin/components/appointments/AdminManageAppointments',
  './AdminManageBlood': '@/features/admin/components/blood/AdminManageBlood',
  './AdminManagePharmacy': '@/features/admin/components/pharmacy/AdminManagePharmacy',
  './AdminManageEquipment': '@/features/admin/components/equipment/AdminManageEquipment',
  './AdminManageClinic': '@/features/admin/components/clinic/AdminManageClinic',
  './AdminManageConsultations': '@/features/admin/components/consultations/AdminManageConsultations',
  './AdminReports': '@/features/admin/components/reports/AdminReports',
  './AdminSettings': '@/features/admin/components/settings/AdminSettings',
  './AdminSupport': '@/features/admin/components/support/AdminSupport',
  './AdminManageFeedback': '@/features/admin/components/feedback/AdminManageFeedback',
  
  '../context/AdminThemeContext': '@/features/admin/context/AdminThemeContext',
  './context/AdminThemeContext': '@/features/admin/context/AdminThemeContext',
  
  // Auth components
  './PatientLogin': '@/features/auth/components/PatientLogin',
  './PatientSignUp': '@/features/auth/components/PatientSignUp',
  './DoctorLogin': '@/features/auth/components/DoctorLogin',
  './DoctorSignUp': '@/features/auth/components/DoctorSignUp',
  './AdminLogin': '@/features/auth/components/AdminLogin',
  './styles/Login.css': '@/features/auth/styles/Login.css',
  
  // Patient components
  './PatientAccount': '@/features/patient/components/PatientAccount',
  './PatientProfile': '@/features/patient/components/PatientProfile',
  './AppointmentForm': '@/features/patient/components/appointments/AppointmentForm',
  './ViewAppointment': '@/features/patient/components/appointments/ViewAppointment',
  './PatientPrescription': '@/features/patient/components/prescriptions/PatientPrescription',
  './ViewPrescription': '@/features/patient/components/prescriptions/ViewPrescription',
  './HealthCard': '@/features/patient/components/health/HealthCard',
  
  // Doctor components
  './DoctorAccount': '@/features/doctor/components/DoctorAccount',
  './DoctorProfile': '@/features/doctor/components/DoctorProfile',
  './PrescriptionForm': '@/features/doctor/components/prescriptions/PrescriptionForm',
  './DoctorDetails': '@/features/doctor/components/details/DoctorDetails',
  
  // Blood Bank
  './BloodBank': '@/features/blood-bank/components/BloodBank',
  './BloodDonor': '@/features/blood-bank/components/BloodDonor',
  './BloodRecipient': '@/features/blood-bank/components/BloodRecipient',
  './BloodAvailability': '@/features/blood-bank/components/BloodAvailability',
  './BloodGroupDetails': '@/features/blood-bank/components/BloodGroupDetails',
  
  // Pharmacy
  './Pharmacy': '@/features/pharmacy/components/Pharmacy',
  './BuyMedicine': '@/features/pharmacy/components/BuyMedicine',
  './AddMedicine': '@/features/pharmacy/components/AddMedicine',
  './MedicineDetails': '@/features/pharmacy/components/MedicineDetails',
  './MedicineBill': '@/features/pharmacy/components/MedicineBill',
  './Items': '@/features/pharmacy/components/Items',
  
  // Clinic
  './BookCabin': '@/features/clinic/components/BookCabin',
  './BookWard': '@/features/clinic/components/BookWard',
  './AdmissionBill': '@/features/clinic/components/AdmissionBill',
  './TestBill': '@/features/clinic/components/TestBill',
  './TestService': '@/features/clinic/components/TestService',
  './AppointmentDetails': '@/features/clinic/components/AppointmentDetails',
  
  // Shared components
  './Navbar': '@/features/shared/components/layout/Navbar',
  './Footer': '@/features/shared/components/layout/Footer',
  './MainLayout': '@/features/shared/components/layout/MainLayout',
  './LoadingSpinner': '@/features/shared/components/ui/LoadingSpinner',
  './SuccessNotification': '@/features/shared/components/ui/SuccessNotification',
  './ErrorBoundary': '@/features/shared/components/ui/ErrorBoundary',
  './AppointmentsChart': '@/features/shared/components/charts/AppointmentsChart',
  './PatientsChart': '@/features/shared/components/charts/PatientsChart',
  './StatsCard': '@/features/shared/components/charts/StatsCard',
  './SupportForm': '@/features/shared/components/forms/SupportForm',
  './PDFGenerator': '@/features/shared/components/utils/PDFGenerator',
  './ECGAnimation': '@/features/shared/components/utils/ECGAnimation',
  './Chatbot': '@/features/shared/components/utils/Chatbot',
  './NewsTicker': '@/features/shared/components/utils/NewsTicker',
  './ProtectedRoute': '@/features/shared/components/ProtectedRoute',
  
  // Pages
  './Home': '@/pages/Home',
  './About': '@/pages/About',
  './Registration': '@/pages/Registration',
  
  // API
  '../api/config': '@/core/api/config',
  './api/config': '@/core/api/config',
  '../../api/config': '@/core/api/config',
};

function updateImportsInFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let updated = false;
  
  for (const [oldPath, newPath] of Object.entries(importMappings)) {
    // Match various import styles
    const patterns = [
      new RegExp(`from ['"]${oldPath.replace(/\//g, '\\/')}['"]`, 'g'),
      new RegExp(`import\\(['"]${oldPath.replace(/\//g, '\\/')}['"]\\)`, 'g'),
    ];
    
    patterns.forEach(pattern => {
      if (pattern.test(content)) {
        content = content.replace(pattern, (match) => {
          updated = true;
          return match.replace(oldPath, newPath);
        });
      }
    });
  }
  
  if (updated) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✓ Updated: ${filePath}`);
  }
  
  return updated;
}

function walkDirectory(dir, callback) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory() && !filePath.includes('node_modules')) {
      walkDirectory(filePath, callback);
    } else if (stat.isFile() && (file.endsWith('.js') || file.endsWith('.jsx'))) {
      callback(filePath);
    }
  });
}

// Run the migration
const srcDir = path.join(__dirname, 'src');
console.log('🔄 Starting import path migration...\n');

let filesUpdated = 0;
walkDirectory(srcDir, (filePath) => {
  if (updateImportsInFile(filePath)) {
    filesUpdated++;
  }
});

console.log(`\n✅ Migration complete! Updated ${filesUpdated} files.`);
