const Permission = require('../models/Permission');
const actions = require('../utils/actions');

exports.createPermission = async (req, res) => {
    try {
        const { action, description } = req.body;

        if (!Object.values(actions).includes(action)) {
            return res.status(400).json({ message: "Invalid action provided" });
        }

        const newPermission = new Permission({ action, description });
        await newPermission.save();
        res.status(201).json({ message: "Permission created successfully", permission: newPermission });
    } catch (error) {
        res.status(500).json({ message: "Failed to create permission", error });
    }
};

// Get a list of all permissions
exports.getAllPermissions = async (req, res) => {
    try {
        const permissions = await Permission.find();
        res.status(200).json(permissions);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch permissions", error });
    }
};

// Update a permission
exports.updatePermission = async (req, res) => {
    const { permissionId } = req.params;
    const { action, description } = req.body;

    try {
        const updatedPermission = await Permission.findByIdAndUpdate(permissionId, { action, description }, { new: true });
        if (!updatedPermission) {
            return res.status(404).json({ message: "Permission not found" });
        }
        res.status(200).json({ message: "Permission updated successfully", permission: updatedPermission });
    } catch (error) {
        res.status(500).json({ message: "Failed to update permission", error });
    }
};

exports.deletePermission = async (req, res) => {
    const { permissionId } = req.params;

    try {
        const deletedPermission = await Permission.findByIdAndDelete(permissionId);
        if (!deletedPermission) {
            return res.status(404).json({ message: "Permission not found" });
        }
        res.status(200).json({ message: "Permission deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Failed to delete permission", error });
    }
};
