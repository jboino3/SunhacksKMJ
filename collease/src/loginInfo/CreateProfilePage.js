import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function CreateProfilePage({ setAuth }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleCreateProfile = (e) => {
    e.preventDefault();
    if (username && password) {
      setAuth(true); 
      navigate('/home'); 
    }
  };

  return (
    <div>
      <h2>Create Profile</h2>
      <form onSubmit={handleCreateProfile}>
        <div>
          <label>Username:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit">Create Profile</button>
      </form>
    </div>
  );
}

export default CreateProfilePage;
