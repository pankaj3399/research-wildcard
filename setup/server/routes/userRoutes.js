const express = require('express');
const router = express.Router();
const UserController = require('../controllers/userController');
const verifyPermission = require('../middleware/verifyPermissions');
const actions = require('../utils/actions');

// Route to create a new user
router.post('/users', verifyPermission(actions.CREATE_USER), UserController.createUser);

// Route to update user details
router.put('/users/:userId', verifyPermission(actions.UPDATE_USER), UserController.updateUser);


// Route to remove a role from a user
router.delete('/users/:userId', verifyPermission(actions.DELETE_USER), UserController.deleteUser);

// Route to list all users
router.get('/users', verifyPermission(actions.LIST_USERS), UserController.listUsers);


module.exports = router;