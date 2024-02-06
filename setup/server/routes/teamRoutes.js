const express = require('express');
const router = express.Router();
const teamController = require('../controllers/teamController');
const verifyPermission = require('../middleware/verifyPermissions');
const actions = require('../utils/actions');



router.post('/teams', verifyPermission(actions.CREATE_TEAM), teamController.createTeam);

// Route to update team details
router.put('/teams/:teamId', verifyPermission(actions.UPDATE_TEAM), teamController.updateTeam);

// Route to add a member to a team (or update an existing member's role)
router.post('/teams/:teamId/members', verifyPermission(actions.ADD_MEMBER_TO_TEAM), teamController.addMember);

// Route to remove a member from a team
router.delete('/teams/:teamId/members/:userId', verifyPermission(actions.REMOVE_MEMBER_FROM_TEAM), teamController.removeMember);

// Route to view team details
router.get('/teams/:teamId', verifyPermission(actions.VIEW_TEAM_DETAILS), teamController.getTeamDetails);

// Route to assign a team to a project
router.post('/teams/:teamId/assign', verifyPermission(actions.ASSIGN_TEAM_TO_PROJECT), teamController.assignTeamToProject);


// Route to update a member's role in a team
router.put('/teams/:teamId/members/:userId', verifyPermission(actions.UPDATE_MEMBER_ROLE_IN_TEAM), teamController.updateMemberRole);



module.exports = router;
