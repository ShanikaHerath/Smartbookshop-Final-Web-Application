import React, { useState } from "react";
import "./chatbot.css";
import axios from "axios";

const Chatbot = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: "bot", message: "Hello! How can I assist you today?" },
  ]);
  const [userMessage, setUserMessage] = useState("");

  const handleSendMessage = async () => {
    if (userMessage.trim()) {
      const newMessages = [...messages, { sender: "user", message: userMessage }];
      setMessages(newMessages);

      try {
        const response = await axios.post("http://localhost:5000/api/chat", {
          query: userMessage,
        });
        const botResponse = response.data.response;

        setMessages((prevMessages) => [
          ...prevMessages,
          { sender: "bot", message: botResponse },
        ]);
      } catch (error) {
        console.error("Error fetching response:", error);
        setMessages((prevMessages) => [
          ...prevMessages,
          { sender: "bot", message: "Oops! Something went wrong. Please try again." },
        ]);
      }

      setUserMessage("");
    }
  };

  return (
    <div>
      {!isChatOpen && (
        <div className="chat-icon" onClick={() => setIsChatOpen(true)}>
          <img
            src="https://cdn-icons-png.flaticon.com/512/4712/4712027.png"
            alt="Chat"
          />
        </div>
      )}

      {isChatOpen && (
        <div className="chat-window">
          <div className="chat-header">
            <h3>Chatbot</h3>
            <button onClick={() => setIsChatOpen(false)}>✕</button>
          </div>

          <div className="chat-messages">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`chat-bubble ${msg.sender === "user" ? "user" : "bot"}`}
              >
                {msg.sender === "bot" && <div className="avatar bot-avatar" />}
                {msg.sender === "user" && <div className="avatar user-avatar" />}
                <span>{msg.message}</span>
              </div>
            ))}
          </div>

          <div className="chat-input">
            <input
              type="text"
              placeholder="Type a message..."
              value={userMessage}
              onChange={(e) => setUserMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
            />
            <button onClick={handleSendMessage}>➤</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbot;
