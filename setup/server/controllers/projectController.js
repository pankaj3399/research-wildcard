const Project = require('../models/ProjectSchema');
const axios = require('axios');
const Employee = require('../models/EmployeeSchema');



exports.createProject = async (req, res) => {
    try {
        console.log('current user', req.user);
        const { title, description, collaborators } = req.body;
        const owner = req.user;  // Use optional chaining to avoid errors if req.user is undefined

        const project = new Project({
            title,
            description,
            owner,
            collaborators,
            studies: []
        });
        await project.save();
        res.status(201).json({ project });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'An error occurred creating the project' });
    }
};




exports.getEmployees = async (req, res) => {
    try {
        const employees = await Employee.find(); // Fetch all employe
        res.json(employees);
    } catch (err) {
        res.status(500).send('Error fetching employees');
    }
};

exports.getProjects = async (req, res) => {
    try {
        const projects = await Project.find().populate('collaborators', 'name');
        res.status(200).json({ projects });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'An error occurred getting your projects' });
    }
}

