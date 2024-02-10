import React, { useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const FormFields = ({ id, label, value, onChange, placeholder, type = "text" }) => (
    <div className="form-group">
        <label htmlFor={id}>{label}</label>
        <input type={type} className="form-control" id={id} value={value} onChange={onChange} placeholder={placeholder} required />
    </div>
);

const SelectField = ({ id, label, value, onChange }) => (
    <div className="form-group">
        <label htmlFor={id}>{label}</label>
        <select className="form-control" id={id} value={value} onChange={onChange}>
            <option>Team 1- John, Alice</option>
            <option>Team 2- Samantha, Bob</option>
        </select>
    </div>
);

const CreateProjectForm = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [startDate, setStartDate] = useState('');
    const [owner, setOwner] = useState('');
    const [pubmedIds, setPubmedIds] = useState('');
    const [isFormOpen, setIsFormOpen] = useState(true);
    const [reviewerEmail, setReviewerEmail] = useState('');
    const [reviewerRole, setReviewerRole] = useState('');
    const [team, setTeam] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();
        const projectData = {
            title,
            description,
            startDate,
            owner,
            team,
            pubmedIds: pubmedIds.split(',').map(id => id.trim()),
        };
        const project = await submitForm(projectData);
        setIsFormOpen(false);
        inviteReviewer(project._id, reviewerEmail, reviewerRole);
    };

    return (
        <>
            {isFormOpen && (
                <form onSubmit={handleSubmit}>
                    <FormFields id="title" label="Title:" value={title} onChange={e => setTitle(e.target.value)} />
                    <FormFields id="description" label="Description:" value={description} onChange={e => setDescription(e.target.value)} />
                    <FormFields id="startDate" label="Start Date:" value={startDate} onChange={e => setStartDate(e.target.value)} type="date" />
                    <FormFields id="owner" label="Owner:" value={owner} onChange={e => setOwner(e.target.value)} placeholder={"Enter your ID number"}/>
                    <FormFields id="pubmedIds" label="PubMed IDs:" value={pubmedIds} onChange={e => setPubmedIds(e.target.value)} placeholder={"Enter PubMed IDs separated by commas"} />
                    <SelectField id="selectTeam" label="Select team:" value={team} onChange={e => setTeam(e.target.value)} />
                    <FormFields id="reviewerEmail" label="Invite Reviewer:" value={reviewerEmail} onChange={e => setReviewerEmail(e.target.value)} type="email" placeholder={"Enter Reviewer Email"} />
                    <FormFields id="reviewerRole" label="Reviewer Role:" value={reviewerRole} onChange={e => setReviewerRole(e.target.value)} placeholder={"Reviewer"} />
                    <button type="submit" className="btn btn-primary">Create Project</button>
                </form>
            )}
            <ToastContainer />
        </>
    );
};

const submitForm = async (projectData) => {
    try {
        const response = await axios.post('http://localhost:3000/project/', projectData);
        return response.data.project;
    } catch (error) {
        console.error('Error creating project:', error);
    }
};

const inviteReviewer = async (projectId, reviewerEmail, reviewerRole) => {
    try { 
        const inviteData = { email: reviewerEmail, role: reviewerRole };
        const response = await axios.post(`http://localhost:3000/project/${projectId}/invite`, inviteData);
        toast(response.data.message);
    } catch (error) {
        console.error('Error inviting reviewer:', error);
    }
};


export default CreateProjectForm;