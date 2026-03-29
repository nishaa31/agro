import { useState } from "react";

const ChatBot = () => {

  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);

  const sendMessage = async () => {

    if (!message) return;

    const userMsg = { sender: "user", text: message };

    setChat([...chat, userMsg]);

    const response = await fetch("http://127.0.0.1:8000/chatbot", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ message })
    });

    const data = await response.json();

    const botMsg = { sender: "bot", text: data.response };

    setChat(prev => [...prev, botMsg]);

    setMessage("");
  };

  return (

    <div style={{ padding: "40px" }}>

      <h1>AI Agriculture Assistant</h1>

      <div
        style={{
          border: "1px solid #ccc",
          height: "400px",
          overflowY: "auto",
          padding: "10px",
          marginBottom: "10px"
        }}
      >

        {chat.map((c, i) => (
          <p key={i}>
            <strong>{c.sender === "user" ? "You" : "Bot"}:</strong> {c.text}
          </p>
        ))}

      </div>

      <input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Ask about crops..."
        style={{ width: "70%", padding: "10px" }}
      />

      <button onClick={sendMessage}>
        Send
      </button>

    </div>
  );
};

export default ChatBot;