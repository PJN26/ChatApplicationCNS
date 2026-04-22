import React, { useState } from 'react';
import './Auth.css';

const NameEntry = ({ onJoin }) => {
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!name.trim()) {
      setError('Please enter your name');
      return;
    }

    if (name.trim().length < 2) {
      setError('Name must be at least 2 characters');
      return;
    }

    onJoin(name.trim());
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h1>🔐 Encrypted Chat</h1>
        <p className="auth-subtitle">Enter your name to start chatting</p>
        
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Your Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setError('');
              }}
              placeholder="Enter your name"
              autoFocus
            />
            {error && <span className="error-message">{error}</span>}
          </div>

          <button type="submit" className="auth-button">
            Join Chat
          </button>
        </form>

        <div className="auth-info">
          <p>✨ End-to-end encrypted messaging</p>
          <p>🔒 Your messages are private and secure</p>
        </div>
      </div>
    </div>
  );
};

export default NameEntry;
