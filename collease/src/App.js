import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import './App.css';
import LoginPage from './loginInfo/LoginPage';
import CreateProfilePage from './loginInfo/CreateProfilePage';
import HomePage from './components/HomePage';

/*function App() {
  // Initialize isAuthenticated based on localStorage or set to false
  const [isAuthenticated, setIsAuthenticated] = useState(
    localStorage.getItem('isAuthenticated') === 'true' || false
  );

  useEffect(() => {
    // Check if the browser supports geolocation
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          console.log(`User location: Latitude ${latitude}, Longitude ${longitude}`);
          
          // Store the location in localStorage (or send it to your server)
          localStorage.setItem('userLocation', JSON.stringify({ latitude, longitude }));
          
          // Optionally send to server
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
            element={isAuthenticated ? <Navigate to="/home" /> : <LoginPage setAuth={handleLogin} />} 
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
*/

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
          {/* Force the user to always go to the /home route */}
          <Route path="/" element={<Navigate to="/home" />} />
          <Route path="/create-profile" element={<CreateProfilePage setAuth={handleLogin} />} />
          {/* Allow everyone to access the home page temporarily */}
          <Route path="/home" element={<HomePage onLogout={handleLogout} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
