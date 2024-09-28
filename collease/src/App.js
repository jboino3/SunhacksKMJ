import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import './App.css';
import LoginPage from './loginInfo/LoginPage';
import CreateProfilePage from './loginInfo/CreateProfilePage';
import HomePage from './components/HomePage';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

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
