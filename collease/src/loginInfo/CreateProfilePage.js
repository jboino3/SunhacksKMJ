import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './CreateProfilePage.css';

function CreateProfilePage({ setAuth }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();

  const handleCreateProfile = (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    const accountData = {
      username,
      password,
    };

    console.log('Account Data:', accountData);
    localStorage.setItem('accountData', JSON.stringify(accountData));

    setAuth(true);
    navigate('/home');
  };

  return (
    <div className="create-profile-container">
      <div className="create-profile-box">
        <h2>Create Account</h2>
        <form onSubmit={handleCreateProfile}>
          <div className="section">
            <h3>Account Information</h3>
            <label>Username:</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <label>Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <label>Confirm Password:</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit">Create Account</button>
        </form>
      </div>
    </div>
  );
}

export default CreateProfilePage;
