import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css';
import logo from '../Images/ColleaseLogo.png'; 

function LoginPage({ setAuth }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    if (username && password) {
      setAuth(true);
      navigate('/home');
    } else {
      setLoginError('Please enter both a username and password.');
    }
  };

  return (
    <div className="login-container">
      <div className="background-overlay"></div> 
      <div className="login-box">
        <img src={logo} alt="Collease Logo" className="logo" />
        <h2>Collease</h2>
        <p className="login-text">Please enter your credentials to Log In.</p>
        {loginError && <p className="error-text">{loginError}</p>}
        <form onSubmit={handleLogin} className="login-form">
          <div className="input-group">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              required
            />
          </div>
          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>
          <button type="submit" className="login-button">Login</button>
        </form>
        <button className="create-profile-button" onClick={() => navigate('/create-profile')}>
          Create Profile
        </button>
      </div>
    </div>
  );
}

export default LoginPage;
