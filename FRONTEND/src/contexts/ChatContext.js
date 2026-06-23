import React, { createContext, useContext, useState } from 'react';

const ChatContext = createContext();

const INITIAL_MESSAGES = [
  {
    sender: 'bot',
    text: 'Hello! I am your HealingWave AI assistant. Ask me about doctors, appointments, blood availability, medicines, or how to use the portal.',
  },
];

/**
 * ChatProvider — mounts once at the App root level (outside all <Route>
 * definitions). Keeps messages alive across in-app navigation.
 * State is intentionally held in memory only: a hard page refresh resets
 * the conversation to the greeting, matching the expected UX behaviour.
 */
export const ChatProvider = ({ children }) => {
  const [messages, setMessages] = useState(INITIAL_MESSAGES);

  return (
    <ChatContext.Provider value={{ messages, setMessages }}>
      {children}
    </ChatContext.Provider>
  );
};

/**
 * useChat — hook for reading and writing the shared chat history.
 * Must be used inside a <ChatProvider>.
 */
export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};
