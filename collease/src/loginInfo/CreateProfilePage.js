import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './CreateProfilePage.css'; // Import the CSS file

function CreateProfilePage({ setAuth }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [address, setAddress] = useState('');
  const [gpa, setGpa] = useState('');
  const [school, setSchool] = useState('');
  const [satScore, setSatScore] = useState('');
  const [actScore, setActScore] = useState('');
  const [transcriptFile, setTranscriptFile] = useState(null);
  const [resumeFile, setResumeFile] = useState(null);
  const [coursesByYear, setCoursesByYear] = useState([{ year: 'Year 1', courses: [{ name: '', grade: 'A+' }] }]);
  const [apScores, setApScores] = useState([{ name: '', score: '1' }]);
  const [projects, setProjects] = useState([{ name: '', description: '', startDate: '', endDate: '' }]);
  const [jobs, setJobs] = useState([{ title: '', description: '', startDate: '', endDate: '' }]);
  const [skills, setSkills] = useState([]);
  const navigate = useNavigate();

  // Fetch reverse geocoded address from Google Maps API
  const getAddressFromCoordinates = async (latitude, longitude) => {
    const apiKey = 'YOUR_GOOGLE_MAPS_API_KEY'; // Replace with your actual Google Maps API key
    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`;
    
    try {
      const response = await fetch(url);
      const data = await response.json();
      if (data.results && data.results.length > 0) {
        setAddress(data.results[0].formatted_address);
      } else {
        console.log('No results found');
      }
    } catch (error) {
      console.error('Error fetching address:', error);
    }
  };

  // Auto-fill location on mount
  useEffect(() => {
    const storedLocation = localStorage.getItem('userLocation');
    if (storedLocation) {
      const { latitude, longitude } = JSON.parse(storedLocation);
      getAddressFromCoordinates(latitude, longitude); // Fetch address from coordinates
    }
  }, []);

  const handleCreateProfile = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    // Prepare the transcript data
    const transcript = coursesByYear.reduce((acc, year) => {
      year.courses.forEach((course) => {
        acc.push([course.name, course.grade, year.year.replace('Year ', '')]);
      });
      return acc;
    }, []);

    const profileData = {
      username,
      password,
      gpa,
      school,
      satScore,
      actScore,
      AP_scores: apScores.map((ap) => [ap.name, ap.score]),
      transcript,
      projects,
      jobs,
      skills,
      address,
    };

    console.log('Profile Data:', profileData);

    // Submit profile data to the backend (e.g., POST request)
    setAuth(true);
    navigate('/home');
  };

  // Handle file uploads
  const handleTranscriptUpload = (e) => {
    const file = e.target.files[0];
    if (file && (file.type === 'application/pdf' || file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document')) {
      setTranscriptFile(file);
    } else {
      alert('Only PDF or DOCX files are allowed for transcripts.');
      e.target.value = ''; // Reset the input field
    }
  };

  const handleResumeUpload = (e) => {
    const file = e.target.files[0];
    if (file && (file.type === 'application/pdf' || file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document')) {
      setResumeFile(file);
    } else {
      alert('Only PDF or DOCX files are allowed for resumes.');
      e.target.value = ''; // Reset the input field
    }
  };

  // Clear file
  const clearTranscriptFile = () => setTranscriptFile(null);
  const clearResumeFile = () => setResumeFile(null);

  // Add and remove years of courses
  const addYear = () => {
    const newYear = `Year ${coursesByYear.length + 1}`;
    setCoursesByYear([...coursesByYear, { year: newYear, courses: [{ name: '', grade: 'A+' }] }]);
  };

  const removeYear = (index) => {
    setCoursesByYear(coursesByYear.filter((_, i) => i !== index));
  };

  const addCourseToYear = (yearIndex) => {
    const updatedYears = [...coursesByYear];
    updatedYears[yearIndex].courses.push({ name: '', grade: 'A+' });
    setCoursesByYear(updatedYears);
  };

  const removeCourseFromYear = (yearIndex, courseIndex) => {
    const updatedYears = [...coursesByYear];
    updatedYears[yearIndex].courses = updatedYears[yearIndex].courses.filter((_, i) => i !== courseIndex);
    setCoursesByYear(updatedYears);
  };

  // Add AP Scores
  const addApScore = () => {
    setApScores([...apScores, { name: '', score: '1' }]);
  };

  const removeApScore = (index) => {
    setApScores(apScores.filter((_, i) => i !== index));
  };

  const handleApScoreChange = (index, field, value) => {
    const updatedApScores = [...apScores];
    updatedApScores[index][field] = value;
    setApScores(updatedApScores);
  };

  // Add and remove project manually
  const addProject = () => setProjects([...projects, { name: '', description: '', startDate: '', endDate: '' }]);
  const removeProject = (index) => setProjects(projects.filter((_, i) => i !== index));

  // Add and remove job manually
  const addJob = () => setJobs([...jobs, { title: '', description: '', startDate: '', endDate: '' }]);
  const removeJob = (index) => setJobs(jobs.filter((_, i) => i !== index));

  // Navigate back to login
  const handleBackToLogin = () => {
    navigate('/');
  };

  return (
    <div className="create-profile-container">
      <div className="create-profile-box">
        <h2>Create Profile</h2>
        <form onSubmit={handleCreateProfile}>
          {/* Account Information */}
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

          {/* Location */}
          <div className="section">
            <h3>Location</h3>
            <label>Address (Autofilled or Enter Manually):</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Enter your address"
              required
            />
          </div>

          {/* Education Information */}
          <div className="section">
            <h3>Education</h3>
            <label>GPA:</label>
            <input
              type="text"
              value={gpa}
              onChange={(e) => setGpa(e.target.value)}
              placeholder="Enter your GPA"
              required
            />
            <label>School:</label>
            <input
              type="text"
              value={school}
              onChange={(e) => setSchool(e.target.value)}
              placeholder="Enter your school name"
              required
            />
            <label>SAT Score (Optional):</label>
            <input
              type="text"
              value={satScore}
              onChange={(e) => setSatScore(e.target.value)}
              placeholder="Enter SAT score"
            />
            <label>ACT Score (Optional):</label>
            <input
              type="text"
              value={actScore}
              onChange={(e) => setActScore(e.target.value)}
              placeholder="Enter ACT score"
            />

            {/* Transcript (Manually Enter Classes and Grades by Year) */}
            <div>
              <h4>Transcript</h4>
              {coursesByYear.map((year, yearIndex) => (
                <div key={yearIndex} className="year-section">
                  <h5>{year.year}</h5>
                  {year.courses.map((course, courseIndex) => (
                    <div key={courseIndex} className="class-grade-container">
                      <input
                        type="text"
                        value={course.name}
                        placeholder="Class Name"
                        onChange={(e) => {
                          const updatedCourses = [...coursesByYear];
                          updatedCourses[yearIndex].courses[courseIndex].name = e.target.value;
                          setCoursesByYear(updatedCourses);
                        }}
                      />
                      <select
                        value={course.grade}
                        onChange={(e) => {
                          const updatedCourses = [...coursesByYear];
                          updatedCourses[yearIndex].courses[courseIndex].grade = e.target.value;
                          setCoursesByYear(updatedCourses);
                        }}
                      >
                        <option value="A+">A+</option>
                        <option value="A">A</option>
                        <option value="A-">A-</option>
                        <option value="B+">B+</option>
                        <option value="B">B</option>
                        <option value="B-">B-</option>
                        <option value="C+">C+</option>
                        <option value="C">C</option>
                        <option value="C-">C-</option>
                        <option value="D+">D+</option>
                        <option value="D">D</option>
                        <option value="D-">D-</option>
                        <option value="F">F</option>
                      </select>
                      <button type="button" className="remove-button" onClick={() => removeCourseFromYear(yearIndex, courseIndex)}>
                        Remove Class
                      </button>
                    </div>
                  ))}
                  <button type="button" className="add-button" onClick={() => addCourseToYear(yearIndex)}>
                    Add Another Class for {year.year}
                  </button>
                  <button type="button" className="remove-button" onClick={() => removeYear(yearIndex)}>
                    Remove {year.year}
                  </button>
                </div>
              ))}
              <button type="button" className="add-button" onClick={addYear}>
                Add Another Year
              </button>
            </div>
          </div>

          {/* AP Scores */}
          <div className="section">
            <h3>AP Scores</h3>
            {apScores.map((ap, index) => (
              <div key={index} className="class-grade-container">
                <input
                  type="text"
                  placeholder="AP Subject"
                  value={ap.name}
                  onChange={(e) => handleApScoreChange(index, 'name', e.target.value)}
                />
                <select
                  value={ap.score}
                  onChange={(e) => handleApScoreChange(index, 'score', e.target.value)}
                >
                  {[1, 2, 3, 4, 5].map((score) => (
                    <option key={score} value={score}>
                      {score}
                    </option>
                  ))}
                </select>
                <button type="button" className="remove-button" onClick={() => removeApScore(index)}>
                  Remove AP Score
                </button>
              </div>
            ))}
            <button type="button" className="add-button" onClick={addApScore}>
              Add Another AP Score
            </button>
          </div>

          {/* Resume Upload or Manual Entry */}
          <div className="section">
            <h3>Resume</h3>
            <label>Upload Resume (PDF or DOCX only):</label>
            <input type="file" onChange={handleResumeUpload} accept=".pdf,.doc,.docx" />
            {resumeFile && (
              <div>
                <p>Uploaded File: {resumeFile.name}</p>
                <button type="button" onClick={clearResumeFile}>Remove Resume</button>
              </div>
            )}

            {!resumeFile && (
              <div>
                <h4>Manually Enter Projects and Work Experience</h4>
                {/* Projects */}
                <div>
                  <h5>Projects</h5>
                  {projects.length === 0 ? (
                    <p>N/A</p>
                  ) : (
                    projects.map((project, index) => (
                      <div key={index} className="project-job-entry">
                        <input
                          type="text"
                          value={project.name}
                          placeholder="Project Name"
                          onChange={(e) => {
                            const newProjects = [...projects];
                            newProjects[index].name = e.target.value;
                            setProjects(newProjects);
                          }}
                        />
                        <label>Start Date:</label>
                        <input
                          type="date"
                          value={project.startDate}
                          onChange={(e) => {
                            const newProjects = [...projects];
                            newProjects[index].startDate = e.target.value;
                            setProjects(newProjects);
                          }}
                        />
                        <label>End Date:</label>
                        <input
                          type="date"
                          value={project.endDate}
                          onChange={(e) => {
                            const newProjects = [...projects];
                            newProjects[index].endDate = e.target.value;
                            setProjects(newProjects);
                          }}
                        />
                        <label>Description:</label>
                        <textarea
                          value={project.description}
                          placeholder="Enter project description"
                          onChange={(e) => {
                            const newProjects = [...projects];
                            newProjects[index].description = e.target.value;
                            setProjects(newProjects);
                          }}
                        />
                        <button type="button" className="remove-button" onClick={() => removeProject(index)}>
                          Remove Project
                        </button>
                      </div>
                    ))
                  )}
                  <button type="button" className="add-button" onClick={addProject}>
                    Add Another Project
                  </button>
                </div>

                {/* Jobs */}
                <div>
                  <h5>Work Experience</h5>
                  {jobs.length === 0 ? (
                    <p>N/A</p>
                  ) : (
                    jobs.map((job, index) => (
                      <div key={index} className="project-job-entry">
                        <input
                          type="text"
                          value={job.title}
                          placeholder="Job Title"
                          onChange={(e) => {
                            const newJobs = [...jobs];
                            newJobs[index].title = e.target.value;
                            setJobs(newJobs);
                          }}
                        />
                        <label>Start Date:</label>
                        <input
                          type="date"
                          value={job.startDate}
                          onChange={(e) => {
                            const newJobs = [...jobs];
                            newJobs[index].startDate = e.target.value;
                            setJobs(newJobs);
                          }}
                        />
                        <label>End Date:</label>
                        <input
                          type="date"
                          value={job.endDate}
                          onChange={(e) => {
                            const newJobs = [...jobs];
                            newJobs[index].endDate = e.target.value;
                            setJobs(newJobs);
                          }}
                        />
                        <label>Description:</label>
                        <textarea
                          value={job.description}
                          placeholder="Enter job description"
                          onChange={(e) => {
                            const newJobs = [...jobs];
                            newJobs[index].description = e.target.value;
                            setJobs(newJobs);
                          }}
                        />
                        <button type="button" className="remove-button" onClick={() => removeJob(index)}>
                          Remove Job
                        </button>
                      </div>
                    ))
                  )}
                  <button type="button" className="add-button" onClick={addJob}>
                    Add Another Job
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Skills */}
          <div className="section">
            <h3>Skills</h3>
            <label>Enter Skills (Separate with commas):</label>
            <input
              type="text"
              value={skills.join(', ')}
              onChange={(e) => setSkills(e.target.value.split(',').map((skill) => skill.trim()))}
              placeholder="Enter your skills"
            />
          </div>

          <button type="submit">Create Profile</button>
        </form>

        {/* Back to Login button */}
        <button className="back-button" onClick={handleBackToLogin}>
          Back to Login
        </button>
      </div>
    </div>
  );
}

export default CreateProfilePage;
