import React, { useState, useEffect } from 'react';
import './HomePage.css';
import collegeMajors from './collegeMajor';

function HomePage() {
  const [previousPrompts, setPreviousPrompts] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchParams, setSearchParams] = useState({
    degree: '',
    schoolSize: '',
    city: '',
    state: '',
    gpa: '',
    satScore: '',
    actScore: '',
    apScores: [{ name: '', score: '1' }],
    projects: [{ name: '', description: '', startDate: '', endDate: '' }],
    jobs: [{ title: '', description: '', startDate: '', endDate: '' }],
    skills: [],
    interests: [],
    transcript: [{ year: 'Year 1', courses: [{ name: '', grade: 'A+' }] }],
  });
  const [newInterest, setNewInterest] = useState('');
  const [newSkill, setNewSkill] = useState('');
  const [searchResults, setSearchResults] = useState([]); // Store the search results
  const [collegeResults, setCollegeResults] = useState([]); // Store the results from GET request
  const [collegeResponse, setCollegeResponse] = useState(null);

  // Function to fetch college results after the POST request
  /*
  const fetchCollegeResults = async () => {
    try {
      const res = await fetch('http://localhost:5001/api/college-data');
      if (!res.ok) {
        throw new Error('Failed to fetch college results');
      }
      const data = await res.json();
      setCollegeResults(data);
    } catch (error) {
      console.error('Error fetching college results:', error);
    }
  };*/

  const schoolSizeOptions = [
    { label: 'Small (1-1,000 students)', value: 'Small' },
    { label: 'Medium (1,001-10,000 students)', value: 'Medium' },
    { label: 'Large (10,001+ students)', value: 'Large' },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSearchParams({
      ...searchParams,
      [name]: value,
    });
  };

  const handleInterestAdd = () => {
    if (newInterest.trim()) {
      setSearchParams({
        ...searchParams,
        interests: [...searchParams.interests, newInterest.trim()],
      });
      setNewInterest(''); // Clear the input field after adding
    }
  };

  const handleSkillAdd = () => {
    if (newSkill.trim()) {
      setSearchParams({
        ...searchParams,
        skills: [...searchParams.skills, newSkill.trim()],
      });
      setNewSkill(''); // Clear the input field after adding
    }
  };

  const handleInterestRemove = (interestToRemove) => {
    setSearchParams({
      ...searchParams,
      interests: searchParams.interests.filter((interest) => interest !== interestToRemove),
    });
  };

  const handleSkillRemove = (skillToRemove) => {
    setSearchParams({
      ...searchParams,
      skills: searchParams.skills.filter((skill) => skill !== skillToRemove),
    });
  };

  const handleApScoreChange = (index, field, value) => {
    const updatedApScores = [...searchParams.apScores];
    updatedApScores[index][field] = value;
    setSearchParams({
      ...searchParams,
      apScores: updatedApScores,
    });
  };

  const addApScore = () => {
    setSearchParams({
      ...searchParams,
      apScores: [...searchParams.apScores, { name: '', score: '1' }],
    });
  };

  const removeApScore = (index) => {
    setSearchParams({
      ...searchParams,
      apScores: searchParams.apScores.filter((_, i) => i !== index),
    });
  };

  const addProject = () => {
    setSearchParams({
      ...searchParams,
      projects: [...searchParams.projects, { name: '', description: '', startDate: '', endDate: '' }],
    });
  };

  const removeProject = (index) => {
    setSearchParams({
      ...searchParams,
      projects: searchParams.projects.filter((_, i) => i !== index),
    });
  };

  const addJob = () => {
    setSearchParams({
      ...searchParams,
      jobs: [...searchParams.jobs, { title: '', description: '', startDate: '', endDate: '' }],
    });
  };

  const removeJob = (index) => {
    setSearchParams({
      ...searchParams,
      jobs: searchParams.jobs.filter((_, i) => i !== index),
    });
  };

  const addYear = () => {
    const newYear = `Year ${searchParams.transcript.length + 1}`;
    setSearchParams({
      ...searchParams,
      transcript: [...searchParams.transcript, { year: newYear, courses: [{ name: '', grade: 'A+' }] }],
    });
  };

  const removeYear = (index) => {
    setSearchParams({
      ...searchParams,
      transcript: searchParams.transcript.filter((_, i) => i !== index),
    });
  };

  const addCourseToYear = (yearIndex) => {
    const updatedTranscript = [...searchParams.transcript];
    updatedTranscript[yearIndex].courses.push({ name: '', grade: 'A+' });
    setSearchParams({ ...searchParams, transcript: updatedTranscript });
  };

  const removeCourseFromYear = (yearIndex, courseIndex) => {
    const updatedTranscript = [...searchParams.transcript];
    updatedTranscript[yearIndex].courses = updatedTranscript[yearIndex].courses.filter((_, i) => i !== courseIndex);
    setSearchParams({ ...searchParams, transcript: updatedTranscript });
  };

  const handleSearch = async (e) => {
    e.preventDefault();

    const studentProfile = {
      gpa: parseFloat(searchParams.gpa),
      SAT: searchParams.satScore ? parseInt(searchParams.satScore, 10) : null,
      ACT: searchParams.actScore ? parseInt(searchParams.actScore, 10) : null,
      AP_scores: searchParams.apScores.map((ap) => [ap.name, parseInt(ap.score, 10)]),
      location: [searchParams.city || '', searchParams.state || ''],
      interests: searchParams.interests,
      degree_preferences: [searchParams.degree],
      school_size: searchParams.schoolSize,
      projects: searchParams.projects,
      jobs: searchParams.jobs,
      skills: searchParams.skills,
      transcript: searchParams.transcript.map((year) => ({
        year: parseInt(year.year.replace('Year ', '')),
        courses: year.courses.map((course) => [course.name, course.grade]),
      })),
    };

    try {
      const res = await fetch('http://localhost:5001/api/college-data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(studentProfile),
      });

      if (!res.ok) {
        throw new Error(`Error: ${res.statusText}`);
      }

      const data = await res.json();
      setCollegeResponse(data)

      /*
      setCollegeResults(data.test)

      // Fetch updated results after successful POST
      await fetchCollegeResults();
      */

      setPreviousPrompts([...previousPrompts, searchParams]);
      setIsSearching(false);
    } catch (error) {
      console.error('Error during search request:', error);
    }
  };

  return (
    <div className="home-container">
      <h2 className="home-title">Find Colleges</h2>

      {isSearching ? (
        <div className="form-container">
          <h3>Search for Colleges</h3>
          <form onSubmit={handleSearch}>
            {/* GPA, SAT, ACT */}
            <div>
              <label>GPA:</label>
              <input
                type="text"
                name="gpa"
                value={searchParams.gpa}
                onChange={handleInputChange}
                placeholder="Enter your GPA"
                required
              />
              <label>SAT Score:</label>
              <input
                type="text"
                name="satScore"
                value={searchParams.satScore}
                onChange={handleInputChange}
                placeholder="Enter SAT score"
              />
              <label>ACT Score:</label>
              <input
                type="text"
                name="actScore"
                value={searchParams.actScore}
                onChange={handleInputChange}
                placeholder="Enter ACT score"
              />
            </div>

            {/* AP Scores */}
            <div>
              <h4>AP Scores</h4>
              {searchParams.apScores.map((ap, index) => (
                <div key={index}>
                  <input
                    type="text"
                    value={ap.name}
                    placeholder="AP Subject"
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
                  <button type="button" onClick={() => removeApScore(index)}>
                    Remove AP Score
                  </button>
                </div>
              ))}
              <button type="button" onClick={addApScore}>
                Add AP Score
              </button>
            </div>

            {/* Projects */}
            <div>
              <h4>Projects</h4>
              {searchParams.projects.map((project, index) => (
                <div key={index}>
                  <input
                    type="text"
                    value={project.name}
                    placeholder="Project Name"
                    onChange={(e) => {
                      const updatedProjects = [...searchParams.projects];
                      updatedProjects[index].name = e.target.value;
                      setSearchParams({ ...searchParams, projects: updatedProjects });
                    }}
                  />
                  <textarea
                    value={project.description}
                    placeholder="Project Description"
                    onChange={(e) => {
                      const updatedProjects = [...searchParams.projects];
                      updatedProjects[index].description = e.target.value;
                      setSearchParams({ ...searchParams, projects: updatedProjects });
                    }}
                  />
                  <label>Start Date:</label>
                  <input
                    type="date"
                    value={project.startDate}
                    onChange={(e) => {
                      const updatedProjects = [...searchParams.projects];
                      updatedProjects[index].startDate = e.target.value;
                      setSearchParams({ ...searchParams, projects: updatedProjects });
                    }}
                  />
                  <label>End Date:</label>
                  <input
                    type="date"
                    value={project.endDate}
                    onChange={(e) => {
                      const updatedProjects = [...searchParams.projects];
                      updatedProjects[index].endDate = e.target.value;
                      setSearchParams({ ...searchParams, projects: updatedProjects });
                    }}
                  />
                  <button type="button" onClick={() => removeProject(index)}>
                    Remove Project
                  </button>
                </div>
              ))}
              <button type="button" onClick={addProject}>
                Add Another Project
              </button>
            </div>

            {/* Jobs */}
            <div>
              <h4>Work Experience</h4>
              {searchParams.jobs.map((job, index) => (
                <div key={index}>
                  <input
                    type="text"
                    value={job.title}
                    placeholder="Job Title"
                    onChange={(e) => {
                      const updatedJobs = [...searchParams.jobs];
                      updatedJobs[index].title = e.target.value;
                      setSearchParams({ ...searchParams, jobs: updatedJobs });
                    }}
                  />
                  <textarea
                    value={job.description}
                    placeholder="Job Description"
                    onChange={(e) => {
                      const updatedJobs = [...searchParams.jobs];
                      updatedJobs[index].description = e.target.value;
                      setSearchParams({ ...searchParams, jobs: updatedJobs });
                    }}
                  />
                  <label>Start Date:</label>
                  <input
                    type="date"
                    value={job.startDate}
                    onChange={(e) => {
                      const updatedJobs = [...searchParams.jobs];
                      updatedJobs[index].startDate = e.target.value;
                      setSearchParams({ ...searchParams, jobs: updatedJobs });
                    }}
                  />
                  <label>End Date:</label>
                  <input
                    type="date"
                    value={job.endDate}
                    onChange={(e) => {
                      const updatedJobs = [...searchParams.jobs];
                      updatedJobs[index].endDate = e.target.value;
                      setSearchParams({ ...searchParams, jobs: updatedJobs });
                    }}
                  />
                  <button type="button" onClick={() => removeJob(index)}>
                    Remove Job
                  </button>
                </div>
              ))}
              <button type="button" onClick={addJob}>
                Add Another Job
              </button>
            </div>

            {/* Transcript */}
            <div>
              <h4>Transcript (Classes and Grades by Year)</h4>
              {searchParams.transcript.map((year, yearIndex) => (
                <div key={yearIndex} className="year-section">
                  <h5>{year.year}</h5>
                  {year.courses.map((course, courseIndex) => (
                    <div key={courseIndex} className="class-grade-container">
                      <input
                        type="text"
                        value={course.name}
                        placeholder="Class Name"
                        onChange={(e) => {
                          const updatedTranscript = [...searchParams.transcript];
                          updatedTranscript[yearIndex].courses[courseIndex].name = e.target.value;
                          setSearchParams({ ...searchParams, transcript: updatedTranscript });
                        }}
                      />
                      <select
                        value={course.grade}
                        onChange={(e) => {
                          const updatedTranscript = [...searchParams.transcript];
                          updatedTranscript[yearIndex].courses[courseIndex].grade = e.target.value;
                          setSearchParams({ ...searchParams, transcript: updatedTranscript });
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
                      <button type="button" onClick={() => removeCourseFromYear(yearIndex, courseIndex)}>
                        Remove Class
                      </button>
                    </div>
                  ))}
                  <button type="button" onClick={() => addCourseToYear(yearIndex)}>
                    Add Another Class for {year.year}
                  </button>
                  <button type="button" onClick={() => removeYear(yearIndex)}>
                    Remove {year.year}
                  </button>
                </div>
              ))}
              <button type="button" onClick={addYear}>
                Add Another Year
              </button>
            </div>

            {/* Skills */}
            <div>
              <h4>Skills</h4>
              <input
                type="text"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                placeholder="Enter your skills"
              />
              <button type="button" onClick={handleSkillAdd}>
                Add Skill
              </button>
              <div>
                {searchParams.skills.map((skill, index) => (
                  <div key={index}>
                    <span>{skill}</span>
                    <button type="button" onClick={() => handleSkillRemove(skill)}>
                      Remove Skill
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Degree, School Size, City, State */}
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

              <label>City:</label>
              <input
                type="text"
                name="city"
                value={searchParams.city}
                onChange={handleInputChange}
                placeholder="Enter your city"
              />

              <label>State:</label>
              <input
                type="text"
                name="state"
                value={searchParams.state}
                onChange={handleInputChange}
                placeholder="Enter your state"
              />
            </div>

            {/* Search and Cancel Buttons */}
            <div>
              <button type="submit">Search</button>
              <button type="button" onClick={() => setIsSearching(false)}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div>
          <button onClick={() => setIsSearching(true)}>Start New College Search</button>
          <div className="prompts-list">
  {previousPrompts.map((prompt, index) => (
    <div key={index} className="prompt-item">
      <p><strong>Degree:</strong> {prompt.degree}</p>
      <p><strong>School Size:</strong> {prompt.schoolSize}</p>
      <p><strong>Location:</strong> {prompt.city ? `${prompt.city}, ${prompt.state}` : 'Not specified'}</p>
      <p><strong>Interests:</strong> {prompt.interests.join(', ')}</p>

      {collegeResponse && (
        <div className="university-list">
          {[1, 2, 3, 4, 5].map((num) => {
            const university = collegeResponse[`University${num}`];
            return university ? (
              <div key={num} className="university-card">
                <h3>{university.Name}</h3>
                <p><strong>Strengths:</strong> {university.Strengths}</p>
                <p><strong>Description:</strong> {university.Description}</p>
              </div>
            ) : null;
          })}
        </div>
      )}
    </div>
  ))}
</div>
          <div className="search-results">
            <h3>Search Results</h3>
            {Array.isArray(searchResults) && searchResults.length > 0 ? (
              <ul>
                {searchResults.map((result, index) => (
                  <li key={index}>
                    {`${result.name} - ${result.location}`}
                  </li>
                ))}
              </ul>
            ) : (
              <p>No search results found.</p>
            )}

            <h3>Previous Results</h3>
            {collegeResults.length > 0 ? (
              <ul>
                <li>
                  <p>Test Score: {collegeResults.test}</p> {/* Display the test score */}
                </li>
              </ul>
            ) : (
              <p>No previous results available.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default HomePage;
