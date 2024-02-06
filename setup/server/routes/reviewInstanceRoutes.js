const express = require('express');
const router = express.Router();
const reviewInstanceController = require('../controllers/reviewInstanceController');
const verifyPermission = require('../middleware/verifyPermissions');
const actions = require('../utils/actions');

// Route to create a new review instance
router.post('/create', verifyPermission(actions.CREATE_REVIEW_INSTANCE), reviewInstanceController.createReviewInstance);

// Route to update the review status of an existing review instance
router.put('/updateStatus', verifyPermission(actions.UPDATE_REVIEW_STATUS), reviewInstanceController.updateReviewStatus);

// Route to aggregate review results for a project
router.get('/aggregateResults/:projectId', verifyPermission(actions.AGGREGATE_REVIEW_RESULTS), reviewInstanceController.aggregateReviewResults);

// Route to get details of a specific review instance
router.get('/details/:reviewInstanceId', verifyPermission(actions.VIEW_REVIEW_DETAILS), reviewInstanceController.getReviewDetails);


module.exports = router;
