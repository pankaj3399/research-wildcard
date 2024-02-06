const express = require('express');
const router = express.Router();
const roleController = require('../controllers/roleController');
const verifyPermission = require('../middleware/verifyPermissions');
const actions = require('../utils/actions');

// Route to create a new role
router.post('/roles', verifyPermission(actions.CREATE_ROLE), roleController.createRole);

// Route to list all roles
router.get('/roles', verifyPermission(actions.LIST_ROLES), roleController.listRoles);

// Route to get details of a specific role
router.get('/roles/:roleId', verifyPermission(actions.GET_ROLE_DETAILS), roleController.getRoleDetails);

// Route to update a role
router.put('/roles/:roleId', verifyPermission(actions.UPDATE_ROLE), roleController.updateRole);


module.exports = router;

