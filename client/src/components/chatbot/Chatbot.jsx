import React, { useState } from 'react'
import "./Chatbot.css"
import { MessageCircle, X } from 'lucide-react'

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([
    { text: "Hello! How can I assist you today?", isUser: false }
  ])
  const [inputMessage, setInputMessage] = useState('')

  const toggleChat = () => {
    setIsOpen(!isOpen)
  }

  const handleSendMessage = (e) => {
    e.preventDefault()
    if (inputMessage.trim()) {
      setMessages([...messages, { text: inputMessage, isUser: true }])
      setInputMessage('')
      // Here you would typically send the message to your chatbot backend
      // and then add the response to the messages array
    }
  }

  return (
    <>
      <div className="chatbot-container">
        <div className="chat-button" onClick={toggleChat}>
          <MessageCircle size={24} />
        </div>
        {isOpen && (
          <div className="chat-window">
            <div className="chat-header">
              <span>Chatbot</span>
              <button className="close-button" onClick={toggleChat}>
                <X size={18} />
              </button>
            </div>
            <div className="chat-messages">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`message ${message.isUser ? 'user-message' : 'bot-message'}`}
                >
                  {message.text}
                </div>
              ))}
            </div>
            <form onSubmit={handleSendMessage} className="chat-input-form">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Type a message..."
                className="chat-input"
              />
              <button type="submit" className="send-button">
                Send
              </button>
            </form>
          </div>
        )}
      </div>
    </>
  )
}

