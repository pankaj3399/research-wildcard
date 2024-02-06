const UserRole = require('../models/UserRole');
const Permission = require('../models/Permission');
const actions = require('../utils/actions');

const verifyPermission = (requiredAction) => async (req, res, next) => {
    try {
        const userId = req.user._id;
        const projectId = req.params.projectId;

        const userRolesInContext = await UserRole.find({ user: userId, project: projectId }).populate({
            path: 'role',
            populate: {
                path: 'permissions'
            }
        });

        const hasPermission = userRolesInContext.some(userRole =>
            userRole.role.permissions.some(permission =>
                permission.equals(requiredAction)
            )
        );

        if (!hasPermission) {
            return res.status(403).json({ message: "Insufficient permissions for this action within the specified project" });
        }

        next();
    } catch (error) {
        res.status(500).json({ message: "Failed to verify permissions", error });
    }
};

module.exports = verifyPermission;
