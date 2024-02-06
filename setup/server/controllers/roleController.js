const Role = require('../models/Role');
const Permission = require('../models/Permission');
const actions = require('../utils/actions'); // Assuming you have an actions.js file with your actions listed

exports.createRole = async (req, res) => {
    const { name, actionKeys } = req.body;

    try {
        const existingRole = await Role.findOne({ name });
        if (existingRole) {
            return res.status(400).json({ message: "Role already exists" });
        }

        const validActions = Object.values(actions);
        const invalidActions = actionKeys.filter(actionKey => !validActions.includes(actionKey));
        if (invalidActions.length > 0) {
            return res.status(400).json({ message: "Invalid action keys provided", invalidActions });
        }

        const permissions = await Permission.find({ action: { $in: actionKeys } });

        if (permissions.length !== actionKeys.length) {
            return res.status(400).json({ message: "Some action keys do not have corresponding permissions in the database" });
        }

        const permissionIds = permissions.map(permission => permission._id);
        const newRole = new Role({
            name,
            permissions: permissionIds
        });

        await newRole.save();
        res.status(201).json({ message: "Role created successfully", role: newRole });
    } catch (error) {
        res.status(500).json({ message: "Failed to create role", error: error.message });
    }
};

exports.listRoles = async (req, res) => {
    try {
        const roles = await Role.find().populate('permissions');
        res.status(200).json(roles);
    } catch (error) {
        res.status(500).json({ message: "Failed to list roles", error: error.message });
    }
};


exports.getRoleDetails = async (req, res) => {
    const { roleId } = req.params;

    try {
        const role = await Role.findById(roleId).populate('permissions');
        if (!role) {
            return res.status(404).json({ message: "Role not found" });
        }
        res.status(200).json(role);
    } catch (error) {
        res.status(500).json({ message: "Failed to get role details", error: error.message });
    }
};


exports.updateRole = async (req, res) => {
    const { roleId } = req.params;
    const { name, actionKeys } = req.body;
    try {
        const permissions = await Permission.find({ 'action': { $in: actionKeys } });

        if (permissions.length !== actionKeys.length) {
            return res.status(400).json({ message: "One or more invalid action keys provided" });
        }

        const permissionIds = permissions.map(permission => permission._id);

        const updatedRole = await Role.findByIdAndUpdate(roleId, { name, permissions: permissionIds }, { new: true }).populate('permissions');

        if (!updatedRole) {
            return res.status(404).json({ message: "Role not found" });
        }

        res.status(200).json({ message: "Role updated successfully", role: updatedRole });
    } catch (error) {
        res.status(500).json({ message: "Failed to update role", error: error.message });
    }
};
