import React from "react"

const ChatRoom = ({name, messages, message, setMessage, sendMessage, deleteMessage}) => (
    <div className="card p-4">
        <h3>Czat</h3>
        <div className="chat-box mb-3" style={{height: '300px', overflowY: 'scroll'}}>
            {messages.map((msg, index) => (
                <div key={index} className="d-flex justify-content-between align-items-center mb-2">
                    <div>
                        <strong>{msg.name}</strong>{msg.message} <span className="text-muted">({ new Date(msg.timestamp).toLocaleTimeString() })</span>
                    </div>
                    {msg.name === localStorage.getItem('user') && (
                        <button className="btn btn-sm btn-danger" onClick={() => deleteMessage(msg.timestamp)}>Usuń</button>
                    )}
                </div>
            ))}
        </div>

        <div className="mb-3">
            <input 
                type="text" 
                className="form-control"
                placeholder="Napisz wiadomość"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
            />
        </div>
        <button className="btn btn-success" onClick={sendMessage}>Wyślij</button>

    </div>
);

export default ChatRoom;