import { useState } from "react";

function ChatBotWidget() {

  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);

  // 🎤 Speech Recognition
  const startListening = () => {

    const recognition = new window.webkitSpeechRecognition();

    recognition.lang = "ta-IN";

    recognition.start();

    recognition.onresult = (event) => {

      const text = event.results[0][0].transcript;

      setMessage(text);

    };

  };


  // 📤 Send Message
  const sendMessage = async () => {

    if (!message) return;

    const userMsg = { sender: "You", text: message };

    setChat(prev => [...prev, userMsg]);

    try {

      const response = await fetch("http://127.0.0.1:8000/chatbot", {

        method: "POST",

        headers: {
          "Content-Type": "application/json"
        },

        body: JSON.stringify({ message })

      });

      const data = await response.json();

      const botMsg = { sender: "Bot", text: data.response };

      setChat(prev => [...prev, botMsg]);

      // 🔊 BOT VOICE SPEAK
      const speech = new SpeechSynthesisUtterance();

      speech.text = data.response;

      speech.rate = 1;

      speech.pitch = 1;

      speech.lang = "en-US";

      window.speechSynthesis.speak(speech);

    }

    catch {

      const botMsg = { sender: "Bot", text: "Backend connection error" };

      setChat(prev => [...prev, botMsg]);

    }

    setMessage("");

  };


  return (

    <div>

      {/* Floating Bot Button */}

      <div
        onClick={() => setOpen(!open)}
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          width: "65px",
          height: "65px",
          borderRadius: "50%",
          background: "linear-gradient(135deg,#2d6a4f,#40916c)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          boxShadow: "0px 4px 12px rgba(0,0,0,0.3)",
          zIndex: 9999
        }}
      >

        <img
          src="https://cdn-icons-png.flaticon.com/512/4712/4712109.png"
          alt="bot"
          width="35"
        />

      </div>


      {/* Chat Window */}

      {open && (

        <div
          style={{
            position: "fixed",
            bottom: "95px",
            right: "20px",
            width: "320px",
            height: "420px",
            background: "#ffffff",
            borderRadius: "15px",
            boxShadow: "0px 6px 20px rgba(0,0,0,0.25)",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            zIndex: 9999
          }}
        >

          {/* Header */}

          <div
            style={{
              background: "linear-gradient(135deg,#2d6a4f,#40916c)",
              color: "white",
              padding: "12px",
              fontWeight: "600"
            }}
          >
            🌾 AI Agriculture Assistant
          </div>


          {/* Chat messages */}

          <div
            style={{
              flex: 1,
              padding: "10px",
              overflowY: "auto",
              background: "#f8f9fa"
            }}
          >

            {chat.map((c, i) => (

              <div
                key={i}
                style={{
                  marginBottom: "10px",
                  textAlign: c.sender === "You" ? "right" : "left"
                }}
              >

                <span
                  style={{
                    display: "inline-block",
                    padding: "8px 12px",
                    borderRadius: "10px",
                    background: c.sender === "You" ? "#40916c" : "#e9ecef",
                    color: c.sender === "You" ? "white" : "#333",
                    maxWidth: "75%"
                  }}
                >
                  {c.text}
                </span>

              </div>

            ))}

          </div>


          {/* Input Area */}

          <div
            style={{
              display: "flex",
              padding: "10px",
              borderTop: "1px solid #ddd"
            }}
          >

            <input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Ask about crops..."
              style={{
                flex: 1,
                padding: "8px",
                borderRadius: "8px",
                border: "1px solid #ccc",
                outline: "none"
              }}
            />

            <button
              onClick={startListening}
              style={{
                marginLeft: "5px",
                padding: "8px",
                borderRadius: "8px",
                border: "none",
                background: "#adb5bd",
                cursor: "pointer"
              }}
            >
              🎤
            </button>

            <button
              onClick={sendMessage}
              style={{
                marginLeft: "5px",
                padding: "8px 12px",
                borderRadius: "8px",
                border: "none",
                background: "#2d6a4f",
                color: "white",
                cursor: "pointer"
              }}
            >
              Send
            </button>

          </div>

        </div>

      )}

    </div>

  );

}

export default ChatBotWidget;