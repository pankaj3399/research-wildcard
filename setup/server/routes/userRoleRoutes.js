const express = require('express');
const router = express.Router();
const userRoleController = require('../controllers/userRoleController');
const verifyPermission = require('../middleware/verifyPermissions');
const actions = require('../utils/actions');

// Route to assign a role to a user
router.post('/assignRole', verifyPermission(actions.ASSIGN_ROLE_TO_USER), userRoleController.assignRoleToUser);

// Route to update a user's role
router.put('/updateRole/:userRoleId', verifyPermission(actions.UPDATE_USER_ROLE), userRoleController.updateUserRole);

// Route to remove a role from a user
router.delete('/removeRole/:userRoleId', verifyPermission(actions.REMOVE_ROLE_FROM_USER), userRoleController.removeRoleFromUser);

// Route to list all user roles
router.get('/listRoles', verifyPermission(actions.LIST_USER_ROLES), userRoleController.listUserRoles);

module.exports = router;