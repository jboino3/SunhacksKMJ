import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import './App.css';
import LoginPage from './loginInfo/LoginPage';
import CreateProfilePage from './loginInfo/CreateProfilePage';
import HomePage from './components/HomePage';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Start unauthenticated

  useEffect(() => {
    // Optionally check if geolocation is supported and get user location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          console.log(`User location: Latitude ${latitude}, Longitude ${longitude}`);
          localStorage.setItem('userLocation', JSON.stringify({ latitude, longitude }));
        },
        (error) => {
          console.error("Error getting location: ", error.message);
        }
      );
    } else {
      console.log("Geolocation is not supported by this browser.");
    }
  }, []);

  // Function to handle login and update authentication state
  const handleLogin = () => {
    setIsAuthenticated(true);
    localStorage.setItem('isAuthenticated', 'true'); // Persist login status
  };

  // Function to handle logout and clear authentication state
  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('isAuthenticated'); // Clear login status
  };

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route 
            path="/" 
            element={<LoginPage setAuth={handleLogin} />} 
          />
          <Route 
            path="/create-profile" 
            element={<CreateProfilePage setAuth={handleLogin} />} 
          />
          <Route 
            path="/home" 
            element={isAuthenticated ? <HomePage onLogout={handleLogout} /> : <Navigate to="/" />} 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;


/*
function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    localStorage.getItem('isAuthenticated') === 'true' || false
  );

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          console.log(`User location: Latitude ${latitude}, Longitude ${longitude}`);
          localStorage.setItem('userLocation', JSON.stringify({ latitude, longitude }));
        },
        (error) => {
          console.error("Error getting location: ", error.message);
        }
      );
    } else {
      console.log("Geolocation is not supported by this browser.");
    }
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
    localStorage.setItem('isAuthenticated', 'true');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('isAuthenticated');
  };

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Navigate to="/home" />} />
          <Route path="/create-profile" element={<CreateProfilePage setAuth={handleLogin} />} />
          <Route path="/home" element={<HomePage onLogout={handleLogout} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
*/