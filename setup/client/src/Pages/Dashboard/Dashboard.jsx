import React, { useEffect, useState } from 'react';
import '../../App.css'; 
import Projects from '../Projects/Projects';
import CompletedProjects from '../Projects/CompletedProjects'; 
import NotificationImportantIcon from '@mui/icons-material/NotificationImportant';
import SearchIcon from '@mui/icons-material/Search';
import Modal from 'react-modal';
import 'reactjs-popup/dist/index.css';
import AddIcon from '@mui/icons-material/Add';
import ProjectForm from '../../Components/projectForm';
import axios from 'axios';
import { useParams } from 'react-router-dom'; 

function Dashboard() {
  const hasNotifications = true;
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [projects, setProjects] = useState([]);
  const [projectTitle, setProjectTitle] = useState('');
  const { projectId } = useParams();
  const [studies, setStudies] = useState([]);

  const openModal = () => {
    setModalIsOpen(true);
  };

  const addNewProject = (project) => {  
    setProjects(prevProjects => [...prevProjects,{ title: project.title, ...project }]);
  };
  const closeModal = () => {
    setModalIsOpen(false);
  };

  const fetchProjects = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/projects/display');
      setProjects(response.data.projects);
    } catch (error) {
      console.error('Failed to fetch projects:', error);
    }
  };


  // Fetch projects when the component mounts
  useEffect(() => {
    fetchProjects();
  }, []);

  
  return (
    <div className="Dashboard">
      <div className="DashboardHeader">
        <div className="SearchBar">
          <input
            type="text"
            placeholder="Search studies"
            className="SearchInput"
          />
          <button className="SearchButton">
            <SearchIcon />
          </button>
        </div>
        <div className="MainContent">
          <div className="SummaryTitle">Summary</div>
          {hasNotifications && (
            <div className="Alert">
              <NotificationImportantIcon className="AlertIcon" />
              <div className="AlertContent">
                <div className="AlertTitle">Alert</div>
                <span className="AlertMessage">You have been invited to create a new project as Project Manager</span>
              </div>
              <button className="ApproveButton">Approve</button>
            </div>
          )}
          <h2 className="SectionTitle">Projects</h2>
          <div>
  {projects.map((project) => (
    <div key={project._id} className="project-card">
      <h3>{project.title}</h3>
    </div>
  ))}
</div>
          <Projects projects={projects} setProjects={setProjects} />
          <button className="CreateButton" onClick={openModal}>
            Create new Project
            <AddIcon />
          </button>
          <Modal
            isOpen={modalIsOpen}
            onRequestClose={closeModal}
            contentLabel="Create New Project"
            style={{
              content: {
                width: '80%',
                height: '80%',
                margin: 'auto',
              },
            }}
          >
            <button onClick={closeModal}>Close </button>
            <ProjectForm setProjectTitle={setProjectTitle} closeModal={closeModal} onProjectCreated={addNewProject}  />
          </Modal>
          <h2 className="SectionTitle">Completed Projects</h2>
          <CompletedProjects />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;