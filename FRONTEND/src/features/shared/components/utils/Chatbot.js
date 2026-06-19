import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import '../../../../components/styles/Chatbot.css';
import { FaPaperPlane, FaRobot, FaTimes } from 'react-icons/fa';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import messageSound from '../../../../assets/message.wav';

// Escape HTML then render a safe subset of markdown: links, bold, line breaks.
const escapeHtml = (s) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const renderMarkdown = (text) => {
  let html = escapeHtml(text);
  // [label](url)
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (m, label, url) => {
    const safeUrl = url.trim();
    const internal = safeUrl.startsWith('/');
    return `<a href="${safeUrl}" data-internal="${internal}" class="chat-link">${label}</a>`;
  });
  html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/\n/g, '<br/>');
  return html;
};

const Chatbot = ({ onClose }) => {
  const navigate = useNavigate();
  const bodyRef = useRef(null);
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Hello! I am your HealingWave AI assistant. Ask me about doctors, appointments, blood availability, medicines, or how to use the portal.' }
  ]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);

  useEffect(() => {
    if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
  }, [messages, typing]);

  // Intercept clicks on internal links so they use the SPA router
  const handleBodyClick = (e) => {
    const a = e.target.closest('a.chat-link');
    if (a && a.getAttribute('data-internal') === 'true') {
      e.preventDefault();
      navigate(a.getAttribute('href'));
      if (onClose) onClose();
    }
  };

  const handleSend = async () => {
    if (input.trim() === '' || typing) return;

    const userMessage = { sender: 'user', text: input };
    const currentMessages = [...messages, userMessage];
    setMessages(currentMessages);
    const outgoing = input;
    setInput('');
    setTyping(true);

    // Build short history for context (exclude the greeting)
    const history = currentMessages
      .slice(1)
      .slice(-6)
      .map((m) => ({ role: m.sender === 'user' ? 'user' : 'assistant', content: m.text }));

    try {
      const response = await axios.post('/api/chatbot/chat', { message: outgoing, history });
      const botMessage = { sender: 'bot', text: response.data.response };
      setMessages((prev) => [...prev, botMessage]);
      try { new Audio(messageSound).play().catch(() => {}); } catch (e) {}
    } catch (error) {
      setMessages((prev) => [...prev, { sender: 'bot', text: 'I am having trouble connecting. Please try again in a moment.' }]);
    } finally {
      setTyping(false);
    }
  };

  return (
    <div className="chatbox">
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
            <button className="chatbox-dismiss" onClick={onClose} aria-label="Close" style={{
              background: 'none', border: 'none', color: 'white', cursor: 'pointer',
              fontSize: '1.4rem', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0, opacity: 0.8
            }}>
              <FaTimes />
            </button>
          )}
        </div>
      </header>

      <section className="chatbox-body" ref={bodyRef} onClick={handleBodyClick}>
        {messages.map((msg, index) => (
          <div key={index} className={`message-wrapper ${msg.sender}-wrapper`}>
            <div
              className={`message ${msg.sender}`}
              dangerouslySetInnerHTML={msg.sender === 'bot' ? { __html: renderMarkdown(msg.text) } : undefined}
            >
              {msg.sender === 'user' ? msg.text : undefined}
            </div>
          </div>
        ))}
        {typing && (
          <div className="message-wrapper bot-wrapper">
            <div className="message bot typing-indicator">
              <span></span><span></span><span></span>
            </div>
          </div>
        )}
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
          <button className="chatbox-send-icon" onClick={handleSend} disabled={!input.trim() || typing}>
            <FaPaperPlane size={18} />
          </button>
        </div>
      </footer>
    </div>
  );
};

export default Chatbot;
