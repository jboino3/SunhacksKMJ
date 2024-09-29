import React, { useState } from 'react';
import './HomePage.css'; // Import the CSS
import collegeMajors from './collegeMajor'; // Import the sorted list of college majors

function HomePage() {
  const [previousPrompts, setPreviousPrompts] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchParams, setSearchParams] = useState({
    degree: '',
    schoolSize: '',
    city: '',
    state: '',
    interests: [] // New interests field to store user's interests
  });
  const [newInterest, setNewInterest] = useState(''); // Temporary state to add new interests

  // Updated school size options with specific ranges
  const schoolSizeOptions = [
    { label: 'Small (1-1,000 students)', value: 'Small' },
    { label: 'Medium (1,001-10,000 students)', value: 'Medium' },
    { label: 'Large (10,001+ students)', value: 'Large' }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSearchParams({
      ...searchParams,
      [name]: value
    });
  };

  const handleInterestAdd = () => {
    if (newInterest.trim()) {
      setSearchParams({
        ...searchParams,
        interests: [...searchParams.interests, newInterest.trim()]
      });
      setNewInterest(''); // Clear the input field after adding
    }
  };

  const handleInterestRemove = (interestToRemove) => {
    setSearchParams({
      ...searchParams,
      interests: searchParams.interests.filter((interest) => interest !== interestToRemove)
    });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    console.log('Searching for colleges with these parameters:', searchParams);
    setPreviousPrompts([...previousPrompts, searchParams]);
    setIsSearching(false);
  };

  if (previousPrompts.length === 0 && !isSearching) {
    return (
      <div className="home-container">
        <h2 className="home-title">Welcome to the College Search App</h2>
        <p>No previous search prompts found.</p>
        <button className="new-search-button" onClick={() => setIsSearching(true)}>
          Start New College Search
        </button>
      </div>
    );
  }

  return (
    <div className="home-container">
      <h2 className="home-title">Home Page</h2>

      {isSearching ? (
        <div className="form-container">
          <h3 className="home-subtitle">Search for Colleges</h3>
          <form onSubmit={handleSearch}>
            <div>
              <label>Degree:</label>
              <select
                name="degree"
                value={searchParams.degree}
                onChange={handleInputChange}
                required
              >
                <option value="">Select a degree</option>
                {collegeMajors.map((degree, index) => (
                  <option key={index} value={degree}>
                    {degree}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label>School Size:</label>
              <select
                name="schoolSize"
                value={searchParams.schoolSize}
                onChange={handleInputChange}
                required
              >
                <option value="">Select school size</option>
                {schoolSizeOptions.map((size, index) => (
                  <option key={index} value={size.value}>
                    {size.label}
                  </option>
                ))}
              </select>
            </div>

            {/* City and State Fields */}
            <div className="location-container">
              <div className="location-field-group">
                <div className="location-field">
                  <label>City (Optional):</label>
                  <input
                    type="text"
                    name="city"
                    value={searchParams.city}
                    onChange={handleInputChange}
                    placeholder="e.g. Los Angeles"
                  />
                </div>
                <div className="location-field">
                  <label>State (Optional):</label>
                  <input
                    type="text"
                    name="state"
                    value={searchParams.state}
                    onChange={handleInputChange}
                    placeholder="e.g. CA"
                  />
                </div>
              </div>
              <p className="form-info">
                * If you choose a city and state, the search will try to find schools based on that area.
              </p>
            </div>

            {/* Interests Section */}
            <div className="interests-section">
              <h3>Interests:</h3>
              <input
                type="text"
                value={newInterest}
                onChange={(e) => setNewInterest(e.target.value)}
                placeholder="Add a new interest"
              />
              <button type="button" onClick={handleInterestAdd}>Add Interest</button>
              
              {/* Display added interests */}
              <div className="interests-list">
                {searchParams.interests.map((interest, index) => (
                  <div key={index} className="interest-item">
                    <span>{interest}</span>
                    <button
                      type="button"
                      onClick={() => handleInterestRemove(interest)}
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <button type="submit">Search</button>
            <button
              type="button"
              className="cancel-button"
              onClick={() => setIsSearching(false)}
            >
              Cancel
            </button>
          </form>
        </div>
      ) : (
        <div className="prompts-container">
          <h3>Previous Search Prompts</h3>
          <div className="prompts-list">
            {previousPrompts.map((prompt, index) => (
              <div key={index} className="prompt-item">
                <p>Degree: {prompt.degree}</p>
                <p>School Size: {prompt.schoolSize}</p>
                <p>Location: {prompt.city ? `${prompt.city}, ${prompt.state}` : 'Not specified'}</p>
                <p>Interests: {prompt.interests.join(', ')}</p>
              </div>
            ))}
          </div>
          <button className="new-search-button" onClick={() => setIsSearching(true)}>
            Start New College Search
          </button>
        </div>
      )}
    </div>
  );
}

export default HomePage;
