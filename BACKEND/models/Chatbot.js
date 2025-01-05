const mongoose = require('mongoose');

const ChatbotSchema = new mongoose.Schema({
  userMessage: String,
  botMessage: String,
});

const Chatbot = mongoose.model('Chatbot', ChatbotSchema);

module.exports = Chatbot;
