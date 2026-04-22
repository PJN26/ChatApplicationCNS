import React, { useState, useEffect, useRef } from 'react';
import socketService from '../services/socketService';
import { encryptMessage, decryptMessage } from '../utils/encryption';
import './Chat.css';

const Chat = ({ username }) => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]); // All messages from all users
  const [newMessage, setNewMessage] = useState('');
  const [typing, setTyping] = useState(false);
  
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const selectedUserRef = useRef(null);

  // Connect to socket on mount
  useEffect(() => {
    socketService.connect(username);
    setupSocketListeners();
    
    return () => {
      socketService.disconnect();
    };
  }, [username]);

  // Auto scroll to bottom
  useEffect(() => {
    scrollToBottom();
  }, [messages, selectedUser]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };


  /**
   * ⚡ SETUP SOCKET LISTENERS
   */
  const setupSocketListeners = () => {
    // Receive online users list
    socketService.onOnlineUsers((onlineUsers) => {
      // Filter out current user
      const otherUsers = onlineUsers.filter(u => u !== username);
      setUsers(otherUsers);
    });

    // Receive messages
    socketService.onMessage((data) => {
      try {
        const plainText = decryptMessage(
          data.encryptedPayload,
          data.iv,
          data.hmac,
          data.sender,
          username
        );
        
        const newMsg = {
          ...data,
          text: plainText,
          isMine: false,
          chatPartner: data.sender // Track who this message is from
        };
        
        // Add message to the list (will be filtered when displaying)
        setMessages(prev => [...prev, newMsg]);
      } catch (error) {
        console.error('Failed to decrypt incoming message:', error);
      }
    });

    // Typing indicator
    socketService.onTyping((data) => {
      if (selectedUserRef.current === data.username) {
        setTyping(true);
      }
    });

    socketService.onStopTyping((data) => {
      if (selectedUserRef.current === data.username) {
        setTyping(false);
      }
    });

    // Error handling
    socketService.onError((error) => {
      console.error('Socket error:', error);
    });
  };


  /**
   * 📤 SEND MESSAGE
   */
  const sendMessage = async (e) => {
    e.preventDefault();
    
    if (!newMessage.trim() || !selectedUser) return;

    try {
      // Encrypt message
      const encrypted = encryptMessage(
        newMessage,
        username,
        selectedUser
      );

      // Prepare message data
      const messageData = {
        sender: username,
        receiver: selectedUser,
        encryptedPayload: encrypted.encryptedPayload,
        iv: encrypted.iv,
        hmac: encrypted.hmac,
        timestamp: new Date()
      };

      // Send via socket
      socketService.sendMessage(messageData);

      // Add to local messages
      const localMsg = {
        ...messageData,
        text: newMessage,
        isMine: true,
        chatPartner: selectedUser // Track who this message is to
      };
      
      setMessages(prev => [...prev, localMsg]);
      setNewMessage('');
      
      // Stop typing indicator
      socketService.sendStopTyping(username, selectedUser);
    } catch (error) {
      console.error('Failed to send message:', error);
      alert('Failed to send message. Please try again.');
    }
  };

  /**
   * 🔔 HANDLE TYPING
   */
  const handleTyping = (e) => {
    setNewMessage(e.target.value);
    
    if (!selectedUser) return;

    // Send typing indicator
    socketService.sendTyping(username, selectedUser);

    // Clear previous timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Stop typing after 2 seconds of inactivity
    typingTimeoutRef.current = setTimeout(() => {
      socketService.sendStopTyping(username, selectedUser);
    }, 2000);
  };

  /**
   * 👤 SELECT USER
   */
  const handleSelectUser = (user) => {
    setSelectedUser(user);
    selectedUserRef.current = user;
    setTyping(false); // Reset typing indicator when switching users
  };

  // Filter messages for the currently selected user
  const displayedMessages = selectedUser 
    ? messages.filter(msg => msg.chatPartner === selectedUser)
    : [];

  return (
    <div className="chat-container">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="sidebar-header">
          <div className="user-info">
            <div className="user-avatar">{username[0].toUpperCase()}</div>
            <div>
              <h3>{username}</h3>
              <span className="status-online">Online</span>
            </div>
          </div>
        </div>

        <div className="users-list">
          <h4>Online Users ({users.length})</h4>
          {users.length === 0 ? (
            <div className="no-users">
              <p>No other users online</p>
            </div>
          ) : (
            users.map(user => (
              <div
                key={user}
                className={`user-item ${selectedUser === user ? 'active' : ''}`}
                onClick={() => handleSelectUser(user)}
              >
                <div className="user-avatar">{user[0].toUpperCase()}</div>
                <div className="user-details">
                  <span className="username">{user}</span>
                  <span className="status-dot online"></span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className="chat-area">
        {selectedUser ? (
          <>
            <div className="chat-header">
              <div className="user-avatar">{selectedUser[0].toUpperCase()}</div>
              <div>
                <h3>{selectedUser}</h3>
                {typing && <span className="typing-indicator">typing...</span>}
                {!typing && <span className="status-online">Online</span>}
              </div>
              <div className="encryption-badge">🔒 Encrypted</div>
            </div>

            <div className="messages-area">
              {displayedMessages.length === 0 && (
                <div className="no-messages">
                  <p>🔐 Start a secure conversation</p>
                  <p className="hint">All messages are end-to-end encrypted</p>
                </div>
              )}
              
              {displayedMessages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`message ${msg.isMine ? 'mine' : 'theirs'} ${msg.error ? 'error' : ''}`}
                >
                  <div className="message-content">
                    {msg.text}
                  </div>
                  <div className="message-time">
                    {new Date(msg.timestamp).toLocaleTimeString([], { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            <form className="message-input-area" onSubmit={sendMessage}>
              <input
                type="text"
                value={newMessage}
                onChange={handleTyping}
                placeholder="Type an encrypted message..."
                className="message-input"
              />
              <button type="submit" className="btn-send">
                Send
              </button>
            </form>
          </>
        ) : (
          <div className="no-chat-selected">
            <h2>🔐 Encrypted Chat</h2>
            <p>Select a user to start messaging</p>
            <div className="features">
              <p>✅ AES-128-CBC Encryption</p>
              <p>✅ End-to-End Security</p>
              <p>✅ Real-time Messaging</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chat;
