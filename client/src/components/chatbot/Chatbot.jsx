
// import React, { useState } from 'react'
// import "./Chatbot.css"
// import { MessageCircle, X } from 'lucide-react'

// export default function Chatbot() {
//   const [isOpen, setIsOpen] = useState(false)
//   const [messages, setMessages] = useState([
//     { text: "Hello! How can I assist you today?", isUser: false }
//   ])
//   const [inputMessage, setInputMessage] = useState('')

//   const toggleChat = () => {
//     setIsOpen(!isOpen)
//   }

//   const handleSendMessage = async (e) => {
//     e.preventDefault()
//     if (inputMessage.trim()) {
//       const userMessage = { text: inputMessage, isUser: true }
//       setMessages((prevMessages) => [...prevMessages, userMessage])
//       setInputMessage('')

//       try {
//         const response = await fetch('http://localhost:5000/chat', {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json'
//           },
//           body: JSON.stringify({ message: inputMessage })
//         })
//         const data = await response.json()
//         setMessages((prevMessages) => [...prevMessages, { text: data.response, isUser: false }])
//       } catch (error) {
//         setMessages((prevMessages) => [...prevMessages, { text: "Error connecting to the server.", isUser: false }])
//       }
//     }
//   }

//   return (
//     <div className="chatbot-container">
//       <div className="chat-button" onClick={toggleChat}>
//         <MessageCircle size={24} />
//       </div>
//       {isOpen && (
//         <div className="chat-window">
//           <div className="chat-header">
//             <span>Chatbot</span>
//             <button className="close-button" onClick={toggleChat}>
//               <X size={18} />
//             </button>
//           </div>
//           <div className="chat-messages">
//             {messages.map((message, index) => (
//               <div
//                 key={index}
//                 className={`message ${message.isUser ? 'user-message' : 'bot-message'}`}
//               >
//                 {message.text}
//               </div>
//             ))}
//           </div>
//           <form onSubmit={handleSendMessage} className="chat-input-form">
//             <input
//               type="text"
//               value={inputMessage}
//               onChange={(e) => setInputMessage(e.target.value)}
//               placeholder="Type a message..."
//               className="chat-input"
//             />
//             <button type="submit" className="send-button">
//               Send
//             </button>
//           </form>
//         </div>
//       )}
//     </div>
//   )
// }

import React, { useState, useEffect, useRef } from 'react'
import "./Chatbot.css"
import { MessageCircle, X } from 'lucide-react'

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([
    { text: "Hello! How can I assist you today?", isUser: false }
  ])
  const [inputMessage, setInputMessage] = useState('')
  const messagesEndRef = useRef(null)

  const toggleChat = () => {
    setIsOpen(!isOpen)
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }

  useEffect(() => {
    scrollToBottom();
  }, [messages])

  const handleSendMessage = async (e) => {
    e.preventDefault()
    if (inputMessage.trim()) {
      const userMessage = { text: inputMessage, isUser: true }
      setMessages((prevMessages) => [...prevMessages, userMessage])
      setInputMessage('')

      const botMessage = { text: '', isUser: false }
      setMessages((prevMessages) => [...prevMessages, botMessage])

      try {
        const response = await fetch('http://localhost:5000/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ message: inputMessage })
        })

        const reader = response.body.getReader()
        const decoder = new TextDecoder()
        let botResponse = ''

        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          botResponse += decoder.decode(value)
          setMessages((prevMessages) => {
            const updatedMessages = [...prevMessages]
            updatedMessages[updatedMessages.length - 1].text = botResponse
            return updatedMessages
          })
        }
      } catch (error) {
        setMessages((prevMessages) => [...prevMessages, { text: "Error connecting to the server.", isUser: false }])
      }
    }
  }

  return (
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
            <div ref={messagesEndRef} />
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
  )
}