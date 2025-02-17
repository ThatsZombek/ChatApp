import { useState, useEffect } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import Login from './components/Login'
import axios from 'axios'
import ChatRoom from './components/ChatRoom'

function App() {
  const [name, setName] = useState("")
  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState([])

  const [token, setToken] = useState(localStorage.getItem('token') || "");

  const handleLogin = (newToken) => {
    localStorage.setItem('token', newToken)
    setToken(newToken);
    localStorage.setItem('user', name)
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    setToken("")
    localStorage.removeItem('user')
  }

  const sendMessage = () => {
    fetch('http://localhost:3000/messages', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({name, message}),
    })
    .then(response => {
      if (response.ok) {
        setMessage('');
        fetchMessages()
      } else {
        alert('Błąd w wysyłaniu wiadomości')
      }
    })
    .catch(error => console.error("Error:", error))
  }

  
  const deleteMessage = (timestamp) => {
    fetch('http://localhost:3000/messages', {
      method: 'DELETE',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({name, timestamp}),
    })
    .then(response => {
      if (response.ok) {
        fetchMessages()
      } else {
        response.json().then(error => alert(error.error))
      }
    })
    .catch(error => console.error("Error:", error))
  }

  const fetchMessages = () => {
    fetch('http://localhost:3000/messages')
    .then(response => response.json())
    .then(data => setMessages(data))
    .catch(error => console.error('Error', error))
  }

  useEffect(() => {
    const interval = setInterval(fetchMessages, 1000)
    return () => clearInterval(interval)
  }, [])

  // ustawia name gdy zmienna w localstorage sie zmieni
  useEffect(() => {
    setName(localStorage.getItem('user') || "");
  }, [localStorage.getItem('user')])

  return (
    <div className='container mt-5'>
    {!token ? (<Login name = {name} setName = {setName} onLogin={handleLogin}/>
    ) : (
      <>
        <ChatRoom 
          name = {name} 
          message = {message} 
          setMessage = {setMessage} 
          messages = {messages} 
          sendMessage = {sendMessage} 
          deleteMessage = {deleteMessage}
        />
        <br/>
        <button className='btn btn-primary' onClick={handleLogout}>Wyloguj</button>
      </>
    )}
    
  </div>
  )
}

export default App
