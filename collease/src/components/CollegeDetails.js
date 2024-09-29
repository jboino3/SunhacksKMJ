import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

function CollegeDetails() {
  const { collegeId } = useParams();
  const [collegeData, setCollegeData] = useState(null);
  
  useEffect(() => {
    // Fetch college details based on the collegeId
    const fetchCollegeDetails = async () => {
      try {
        const response = await fetch(`http://localhost:5001/api/college-data/${collegeId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch college details');
        }
        const data = await response.json();
        setCollegeData(data); 
      } catch (error) {
        console.error('Error fetching college details:', error);
      }
    };
    
    fetchCollegeDetails();
  }, [collegeId]);

  return (
    <div className="college-details-container">
      {collegeData ? (
        <div>
          <h2>{collegeData.name}</h2>
          <p>Location: {collegeData.location}</p>
          <p>Description: {collegeData.description}</p>
          {/* Display other information from the API */}
          <p>Programs Offered: {collegeData.programs.join(', ')}</p>
          <p>Student Population: {collegeData.studentPopulation}</p>
        </div>
      ) : (
        <p>Loading college details...</p>
      )}
    </div>
  );
}

export default CollegeDetails;
