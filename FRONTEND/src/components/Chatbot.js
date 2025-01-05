import React, { useState } from 'react';
import axios from 'axios';
import 'bulma/css/bulma.min.css';
import './styles/Chatbot.css';
import { FaPaperPlane } from 'react-icons/fa'; 
import { Helmet } from 'react-helmet';
import messageSound from '../assets/message.wav';

const Chatbot = () => {
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Hello! How can I help you? If you want to know any info, write it in the chatbox.' }
  ]);
  const [input, setInput] = useState('');
  const [showChatbox, setShowChatbox] = useState(true); 

  const handleSend = async () => {
    if (input.trim() === '') return;

    const userMessage = { sender: 'user', text: input };
    setMessages([...messages, userMessage]);

    try {
      const response = await axios.post('/api/chatbot/chat', { message: input });
      const botMessage = { sender: 'bot', text: response.data.response };
      setMessages([...messages, userMessage, botMessage]);

     
      const audio = new Audio(messageSound);
      audio.play();
    } catch (error) {
      const botMessage = { sender: 'bot', text: 'Sorry, there was an error. Please try again.' };
      setMessages([...messages, userMessage, botMessage]);
    }

    setInput('');
  };

  

  return (
    <div className={`chatbox ${!showChatbox ? 'hidden' : ''}`}>
      <Helmet>
        <title>Chatbot</title>
      </Helmet>
      <header className="chatbox-header">
        <p className="chatbox-title">Chat with us</p>
        
      </header>
      <section className="chatbox-body">
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.sender}`}>
            {msg.text}
          </div>
        ))}
      </section>
      <footer className="chatbox-footer">
        <div className="chatbox-input-container">
          <input
            className="input chatbox-input"
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message..."
            onKeyPress={(e) => e.key === 'Enter' && handleSend()} 
          />
          <button className="chatbox-send-icon" onClick={handleSend}>
            <FaPaperPlane size={20} />
          </button>
        </div>
      </footer>
    </div>
  );
};

export default Chatbot;
