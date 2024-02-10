const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');
const multer = require('multer');
const verifyPermission = require('../middleware/verifyPermissions');
const actions = require('../utils/actions');

const fileFilter = (req, file, cb) => {
    const allowedTypes = /pdf|xml/;
    const isAccepted = allowedTypes.test(file.mimetype) && allowedTypes.test(file.originalname.toLowerCase());

    if (isAccepted) {
        return cb(null, true);
    } else {
        return cb(new Error('Only PDF and XML files are allowed'), false);
    }
};

const upload = multer({
    dest: 'uploads/',
    fileFilter: fileFilter,
    limits: { fileSize: 10 * 1024 * 1024 } // for 10MB
});

// Create a new project
router.post('/projects', verifyPermission(actions.CREATE_PROJECT), projectController.createProject);

// Import articles into a project (handles both PubMed IDs and file uploads)
router.post('/projects/:projectId/articles', verifyPermission(actions.IMPORT_ARTICLES), upload.array('articles'), projectController.importArticles);

// Update an article's review status within a project
router.put('/projects/:projectId/articles/:articleId/reviewStatus', verifyPermission(actions.UPDATE_ARTICLE_REVIEW_STATUS), projectController.updateArticleReviewStatus);

// Assign an article to a reviewer within a project
router.post('/projects/:projectId/articles/:articleId/reviewAssignments', verifyPermission(actions.ASSIGN_ARTICLE_TO_REVIEWER), projectController.assignArticleToReviewer);

// Update the status of a review stage within a project
router.put('/projects/:projectId/reviewStages', verifyPermission(actions.UPDATE_REVIEW_STAGE_STATUS), projectController.updateReviewStageStatus);

// Add a collaborator to a project
router.post('/projects/:projectId/collaborators', verifyPermission(actions.ADD_COLLABORATOR), projectController.addCollaborator);

// Delete a project
router.delete('/projects/:projectId', verifyPermission(actions.DELETE_PROJECT), projectController.deleteProject);

// fetch studies
router.get('/projects/:projectId/articles', verifyPermission(actions.GET_STUDIES), projectController.getStudies);

//fetch projects
router.get('/projects/display', verifyPermission(actions.GET_PROJECTS), projectController.getProjects);

module.exports = router;
