const UserRole = require('../models/UserRole');
const User = require('../models/User');
const Role = require('../models/Role');
const Project = require('../models/Project');


exports.assignRoleToUser = async (req, res) => {
    const { userId, roleId, projectId, teamId } = req.body;

    try {
        const user = await User.findById(userId);
        const role = await Role.findById(roleId);
        if (!user || !role) {
            return res.status(404).json({ message: "User or Role not found" });
        }
        const newUserRole = new UserRole({
            user: userId,
            role: roleId,
            project: projectId,
            team: teamId
        });

        await newUserRole.save();
        res.status(201).json({ message: "Role assigned to user successfully", userRole: newUserRole });
    } catch (error) {
        res.status(500).json({ message: "Failed to assign role to user", error: error.message });
    }
};

exports.updateUserRole = async (req, res) => {
    const { userRoleId } = req.params;
    const { roleId, projectId, teamId } = req.body;

    try {
        const userRole = await UserRole.findById(userRoleId);
        if (!userRole) {
            return res.status(404).json({ message: "UserRole not found" });
        }

        userRole.role = roleId || userRole.role;
        userRole.project = projectId || userRole.project;
        userRole.team = teamId || userRole.team;

        await userRole.save();
        res.status(200).json({ message: "UserRole updated successfully", userRole });
    } catch (error) {
        res.status(500).json({ message: "Failed to update userRole", error: error.message });
    }
};

exports.removeRoleFromUser = async (req, res) => {
    const { userRoleId } = req.params;

    try {
        const userRole = await UserRole.findByIdAndDelete(userRoleId);
        if (!userRole) {
            return res.status(404).json({ message: "UserRole not found" });
        }
        res.status(200).json({ message: "UserRole removed successfully" });
    } catch (error) {
        res.status(500).json({ message: "Failed to remove userRole", error: error.message });
    }
};

exports.listUserRoles = async (req, res) => {
    const { userId } = req.params;

    try {
        const userRoles = await UserRole.find({ user: userId })
            .populate('role')
            .populate('project')
            .populate('team');

        const rolesDetails = userRoles.map(userRole => ({
            role: userRole.role.name,
            projectId: userRole.project ? userRole.project._id : null,
            projectName: userRole.project ? userRole.project.name : null,
            teamId: userRole.team ? userRole.team._id : null,
            teamName: userRole.team ? userRole.team.name : null,
        }));

        res.status(200).json(rolesDetails);
    } catch (error) {
        res.status(500).json({ message: "Failed to list user roles", error });
    }
};

