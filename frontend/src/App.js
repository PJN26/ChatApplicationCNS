import React, { useState } from 'react';
import NameEntry from './components/NameEntry';
import Chat from './components/Chat';

function App() {
  const [username, setUsername] = useState(null);

  const handleJoin = (name) => {
    setUsername(name);
  };

  return (
    <div>
      {!username ? (
        <NameEntry onJoin={handleJoin} />
      ) : (
        <Chat username={username} />
      )}
    </div>
  );
}

export default App;
