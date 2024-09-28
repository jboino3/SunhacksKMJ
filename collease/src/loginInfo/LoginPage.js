import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function LoginPage({ setAuth }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    // Simple authentication logic for demonstration
    if (username && password) {
      setAuth(true); // Set authenticated
      navigate('/home'); // Redirect to home page
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
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
        <button type="submit">Login</button>
      </form>
      <button onClick={() => navigate('/create-profile')}>Create Profile</button>
    </div>
  );
}

export default LoginPage;
