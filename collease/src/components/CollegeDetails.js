import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

function CollegeDetails() {
  const { collegeId } = useParams(); 
  const [collegeData, setCollegeData] = useState(null);
  
  useEffect(() => {
    const fetchCollegeDetails = async () => {
      try {
        const response = await fetch(`http://localhost:5001/api/college-data`);
        if (!response.ok) {
          throw new Error('Failed to fetch college details');
        }
        const data = await response.json();

        setCollegeData(data[collegeId]); 
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
          <h2>{collegeData.Name}</h2>
          <p><strong>Strengths:</strong> {collegeData.Strengths}</p>
          <p><strong>Description:</strong> {collegeData.Description}</p>
        </div>
      ) : (
        <p>Loading college details...</p>
      )}
    </div>
  );
}

export default CollegeDetails;
