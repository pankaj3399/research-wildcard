import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import axios from 'axios';
import PieChartIcon from '@mui/icons-material/PieChart';
import PersonIcon from '@mui/icons-material/Person';
import PushPinIcon from '@mui/icons-material/PushPin';
import './Projects.css'; 

function Projects({ projects = [], setProjects }) {
  const navigate = useNavigate();
  const [clickedPushPins, setClickedPushPins] = useState({});

  const togglePushPin = (projectId) => {
    setClickedPushPins(prevPushPins => ({
      ...prevPushPins,
      [projectId]: !prevPushPins[projectId]
    }));
  };

  const goToChartPage = () => {
    navigate('/chart-page'); // Replace with ACTUAL route
  };

  const fetchProjects = async () => {
    try {
      const token = localStorage.getItem('token'); 
      console.log("token:", token);
      const response = await axios.get('http://localhost:3000/project/', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProjects(response.data.projects);
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]); 

  return (
    <div className="ProjectsSection">
      {projects.map((project, index) => (
        <div className="ProjectWrapper" key={project._id || index}>
          <PersonIcon className="UserIcon" />
          <div className="ProjectItem">
            <Link to={`/oneproject/${project._id || index}`}>
              <div className="ProjectTitle">{project.title}</div>
            </Link>
            <div className="ProgressContainer">
              <div className="ProgressBar" style={{ width: `${project.progression}%` }}></div>
            </div>
            <div className="ProgressPercentage">{project.progression}%</div>
          </div>
          <div onClick={goToChartPage}>
            <PieChartIcon className="ProjectChartIcon" style={{ fontSize: '40px' }} />
          </div>
          <div onClick={() => togglePushPin(project._id || index)}>
            <PushPinIcon className='ProjectPushPinIcon'
              style={{ 
                fontSize: '40px', 
                color: clickedPushPins[project._id || index] ? 'red' : 'black' 
              }} 
            />
          </div>
        </div>
      ))}
    </div>
  );
}

export default Projects;