const express = require('express');
const router = express.Router();
const titleabstractScreenController = require('../controllers/titleabstractScreen');
const multer = require('multer');
const verifyPermission = require('../middleware/verifyPermissions');
const actions = require('../utils/actions');

// Update an article's screening status within a project
router.put('/articles/:articleId/title-screen', verifyPermission(actions.UPDATE_ARTICLE_REVIEW_STATUS), titleabstractScreenController.updateTitleStudyScreeningStatus);
router.put('/articles/:articleId/body-screen', verifyPermission(actions.UPDATE_ARTICLE_REVIEW_STATUS), titleabstractScreenController.updateBodyStudyScreeningStatus);


module.exports = router;


