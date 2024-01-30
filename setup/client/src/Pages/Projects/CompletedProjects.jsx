import React from 'react';
import PeopleIcon from '@mui/icons-material/People';
import EditIcon from '@mui/icons-material/Edit';
import DownloadIcon from '@mui/icons-material/GetApp';
import DeleteIcon from '@mui/icons-material/Delete';
import './CompletedProjects.css';
import { Link } from "react-router-dom";


// fake data for completed projects
const completedProjectsData = [
  {
    title: 'Completed Project 1',
  },
  {
    title: 'Completed Project 2',
  },
  // ... more completed projects
];

function CompletedProjects() {
    return (
      <div className="CompletedProjects">
        {completedProjectsData.map((project, index) => (
          <div className="CompletedProjectItem" key={index}>
            <PeopleIcon className="PeopleIcon" />
            <span className="CompletedProjectTitle">{project.title}</span>
            <div className="CompletedProjectActions">
              <EditIcon className="ActionIcon" />
              <DownloadIcon className="ActionIcon" />
              <DeleteIcon className="ActionIcon" />
              <Link to="/oneproject">Go to Project</Link>
              
            </div>
          </div>
        ))}
      </div>
    );
  }

export default CompletedProjects;

