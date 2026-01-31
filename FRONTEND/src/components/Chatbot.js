import React, { useState } from 'react';
import axios from 'axios';
import './styles/Chatbot.css';
import { FaPaperPlane, FaRobot, FaUser, FaTimes } from 'react-icons/fa'; 
import { Helmet } from 'react-helmet';
import messageSound from '../assets/message.wav';
import { useTheme } from '../contexts/ThemeContext';

const Chatbot = ({ onClose }) => {
  const { theme } = useTheme();
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Hello! I am your HealingWave assistant. How can I help you today?' }
  ]);
  const [input, setInput] = useState('');

  const handleSend = async () => {
    if (input.trim() === '') return;

    const userMessage = { sender: 'user', text: input };
    const currentMessages = [...messages, userMessage];
    setMessages(currentMessages);
    setInput('');

    try {
      const response = await axios.post('/api/chatbot/chat', { message: input });
      const botMessage = { sender: 'bot', text: response.data.response };
      setMessages([...currentMessages, botMessage]);

      const audio = new Audio(messageSound);
      audio.play().catch(e => console.log('Audio play blocked'));
    } catch (error) {
      const botMessage = { sender: 'bot', text: 'I am having trouble connecting. Please try again in a moment.' };
      setMessages([...currentMessages, botMessage]);
    }
  };

  return (
    <div className={`chatbox ${theme === 'dark' ? 'dark-mode' : ''}`}>
      <Helmet>
        <title>Assistant - HealingWave</title>
      </Helmet>
      
      <header className="chatbox-header">
        <div className="header-info">
          <FaRobot className="bot-icon" />
          <div style={{ flex: 1 }}>
            <p className="chatbox-title">HealingWave AI</p>
            <span className="online-status">Online</span>
          </div>
          {onClose && (
            <button className="chatbox-dismiss" onClick={onClose} style={{
              background: 'none',
              border: 'none',
              color: 'white',
              cursor: 'pointer',
              fontSize: '1.2rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '5px',
              borderRadius: '50%',
              transition: 'background 0.2s'
            }}>
              <FaTimes />
            </button>
          )}
        </div>
      </header>

      <section className="chatbox-body">
        {messages.map((msg, index) => (
          <div key={index} className={`message-wrapper ${msg.sender}-wrapper`}>
            <div className={`message ${msg.sender}`}>
              {msg.text}
            </div>
          </div>
        ))}
      </section>

      <footer className="chatbox-footer">
        <div className="chatbox-input-container">
          <input
            className="chatbox-input"
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="How can we help?"
            onKeyPress={(e) => e.key === 'Enter' && handleSend()} 
          />
          <button className="chatbox-send-icon" onClick={handleSend} disabled={!input.trim()}>
            <FaPaperPlane size={18} />
          </button>
        </div>
      </footer>
    </div>
  );
};

export default Chatbot;
