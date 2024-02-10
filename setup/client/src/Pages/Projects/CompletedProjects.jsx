import React from 'react';
import PeopleIcon from '@mui/icons-material/People';
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
          <Link to={`/oneproject/${project.id}`} key={index} style={{ textDecoration: 'none' }}>
          <div className="CompletedProjectItem" key={index}>
            <PeopleIcon className="PeopleIcon" />
            <span className="CompletedProjectTitle">{project.title}</span>
            <div className="CompletedProjectActions">
            <Link to="/export" className="Export">
                <div className="ExportTitle">
                Export
                </div>
                <div className="ExportIcon">
                <DownloadIcon />
                </div>
              </Link>
              <Link to="/dashboard" className="ActionIcon">
                <DeleteIcon />
              </Link>  
            </div>
          </div>
        </Link>
        ))}
      </div>
    );
  }

export default CompletedProjects;

