import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import './App.css';
import LoginPage from './loginInfo/LoginPage';
import CreateProfilePage from './loginInfo/CreateProfilePage';
import HomePage from './components/HomePage';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if the browser supports geolocation
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          console.log(`User location: Latitude ${latitude}, Longitude ${longitude}`);
          
          // Store the location in localStorage (or send it to your server)
          localStorage.setItem('userLocation', JSON.stringify({ latitude, longitude }));
          
          // fetch('/store-location', {
          //   method: 'POST',
          //   headers: { 'Content-Type': 'application/json' },
          //   body: JSON.stringify({ latitude, longitude })
          // });
        },
        (error) => {
          console.error("Error getting location: ", error.message);
        }
      );
    } else {
      console.log("Geolocation is not supported by this browser.");
    }
  }, []); 

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={isAuthenticated ? <Navigate to="/home" /> : <LoginPage setAuth={setIsAuthenticated} />} />
          <Route path="/create-profile" element={<CreateProfilePage setAuth={setIsAuthenticated} />} />
          <Route path="/home" element={isAuthenticated ? <HomePage /> : <Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
