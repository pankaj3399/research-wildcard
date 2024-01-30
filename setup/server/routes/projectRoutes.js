const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');
const Project = require('../models/ProjectSchema');

router.get('/employees', projectController.getEmployees);
router.post('/create', projectController.createProject);

router.get('/', async (req, res) => {
    if (!req.user) {
      return res.status(401).send('Access denied. No token provided.');
    }
  
    try {
      const userId = req.user._id;
      const projects = await Project.find({
        $or: [
          { owner: userId },
          { collaborators: { $in: [userId] } }
        ]
      });
      res.json({ projects });
    } catch (err) {
      res.status(500).json({ message: 'Error fetching projects' });
    }
  });

module.exports = router;