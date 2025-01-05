const express = require('express');
const router = express.Router();
const Chatbot = require('../models/Chatbot');

// Define the responses for different queries
const responses = {
  default: "I'm sorry, I didn't quite understand that. Could you please rephrase or specify your request?",
  hello: "Hello! How can I assist you today? Whether you need information on our services, making an appointment, or anything else, I'm here to help.",
  healthCard: "Our Health Card is designed to make healthcare easier. You can use it to pay for medicines, tests, and bills, while earning points for future services. Please [log in](patient-login) to your account to manage your Health Card.",
  bloodbank: "Our Blood Bank service offers detailed information on blood donors, recipients, availability, and blood group compatibility. How can I assist you today?",
  bloodDonor: "Thank you for your interest in donating blood. Visit our [Blood Bank](blood-bank) page to learn more about how you can contribute and save lives.",
  bloodRecipient: "If you need blood or want to know more about receiving it, please visit our [Blood Bank](blood-bank) page for detailed information.",
  bloodGroup: "Understanding blood group compatibility is crucial for safe transfusions. Please [click here](blood-bank) to learn more.",
  patientInfo: "With a patient account, you can easily pay bills, view prescriptions, schedule appointments, and more. Please [register](patient-signup) or [log in](patient-login) to access these features.",
  doctorInfo: "Doctors can manage prescriptions, view patient details, and more through their account. Please [register](doctor-signup) or [log in](doctor-login) to access your dashboard.",
  payments: "To pay for tests, medicines, or ward/cabin bills, please [log in](patient-login) to your account. Secure and convenient payment options are available.",
  appointments: "Managing appointments is simple. Please [log in](patient-login) to schedule or view appointments and to see doctor details.",
  testsAndServices: "We offer a wide range of diagnostic tests, lab services, and specialist consultations. Please [log in](patient-login) to access these services and view your results.",
  support: "If you need any assistance, please visit our [Support](support) page where we offer help with common issues and live chat support.",
  about: "Learn more about our mission, values, and the services we offer by visiting our [About](about) page.",
  bloodDonateAndReceive: `
    **Blood Group Compatibility:**
    - **O-**: Universal donor for all blood types, can receive only from O-.
    - **O+**: Can donate to O+, A+, B+, AB+, can receive from O-, O+.
    - **A-**: Can donate to A+, A-, AB+, AB-, can receive from O-, A-.
    - **A+**: Can donate to A+, AB+, can receive from O-, O+, A-, A+.
    - **B-**: Can donate to B+, B-, AB+, AB-, can receive from O-, B-.
    - **B+**: Can donate to B+, AB+, can receive from O-, O+, B-, B+.
    - **AB-**: Can donate to AB+, AB-, can receive from O-, A-, B-, AB-.
    - **AB+**: Universal recipient, can receive from all blood types.
    
    For more detailed information or to schedule a donation, please visit our [Blood Bank](blood-bank) page.
  `,
};

// Chatbot interaction endpoint
router.post('/chat', async (req, res) => {
  const { message } = req.body;
  const lowerCaseMessage = message.toLowerCase();
  
  let response = responses.default;

  if (/blood donate and receive/.test(lowerCaseMessage)) {
    response = responses.bloodDonateAndReceive;
  } else if (/blood donor/.test(lowerCaseMessage)) {
    response = responses.bloodDonor;
  } else if (/blood recipient/.test(lowerCaseMessage)) {
    response = responses.bloodRecipient;
  } else if (/blood group/.test(lowerCaseMessage)) {
    response = responses.bloodGroup;
  } else if (/blood bank/.test(lowerCaseMessage)) {
    response = responses.bloodbank;
  } else if (/hello/.test(lowerCaseMessage)) {
    response = responses.hello;
  } else if (/health card/.test(lowerCaseMessage)) {
    response = responses.healthCard;
  } else if (/patient/.test(lowerCaseMessage)) {
    response = responses.patientInfo;
  } else if (/doctor/.test(lowerCaseMessage)) {
    response = responses.doctorInfo;
  } else if (/pay/.test(lowerCaseMessage)) {
    response = responses.payments;
  } else if (/appointment/.test(lowerCaseMessage)) {
    response = responses.appointments;
  } else if (/test|service/.test(lowerCaseMessage)) {
    response = responses.testsAndServices;
  } else if (/support/.test(lowerCaseMessage)) {
    response = responses.support;
  } else if (/about/.test(lowerCaseMessage)) {
    response = responses.about;
  }

  // Save the interaction
  const chatbotInteraction = new Chatbot({
    userMessage: message,
    botMessage: response,
  });

  await chatbotInteraction.save();

  res.json({ response });
});

module.exports = router;
