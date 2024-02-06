const Team = require('../models/Team');
const Project = require('../models/Project');
const User = require('../models/User');
const UserRole = require('../models/UserRole');
const Role = require('../models/Role');

exports.createTeam = async (req, res) => {
    const { name, description, teamManagerUserId } = req.body;

    try {
        const user = await User.findById(teamManagerUserId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const teamManagerRole = await Role.findOne({ name: 'Team Manager' });
        if (!teamManagerRole) {
            return res.status(404).json({ message: "'Team Manager' role not found" });
        }

        const newTeam = new Team({ name, description });
        await newTeam.save();

        // Assign the 'Team Manager' role to the user for this team
        const newUserRole = new UserRole({
            user: teamManagerUserId,
            role: teamManagerRole._id,
            team: newTeam._id
        });
        await newUserRole.save();

        res.status(201).json({ message: "Team and Team Manager created successfully", team: newTeam });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to create team", error: error.message });
    }
};

exports.addMember = async (req, res) => {
    const { teamId } = req.params;
    const { userId, roleId } = req.body;

    try {
        const team = await Team.findById(teamId);
        const user = await User.findById(userId);
        const role = await Role.findById(roleId);

        if (!team) {
            return res.status(404).json({ message: "Team not found" });
        }
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        if (!role) {
            return res.status(404).json({ message: "Role not found" });
        }

        const isMemberAlready = team.members.some(member => member.user.equals(userId));

        if (isMemberAlready) {
            return res.status(400).json({ message: "User is already a member of the team" });
        }

        // Add user to the team
        team.members.push({ user: userId, role: roleId });
        await team.save();

        const newUserRole = new UserRole({ user: userId, role: roleId, team: teamId });
        await newUserRole.save();

        res.status(201).json({ message: "Member added to team successfully", team });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to add member to team", error: error.message });
    }
};
exports.updateMemberRole = async (req, res) => {
    const { teamId, userId } = req.params;
    const { newRoleId } = req.body;

    try {
        // Check if the new role exists
        const newRoleExists = await Role.exists({ _id: newRoleId });
        if (!newRoleExists) {
            return res.status(404).json({ message: "New role not found" });
        }

        // Find and update the UserRole for this user within the team
        const updatedUserRole = await UserRole.findOneAndUpdate(
            { user: userId, team: teamId },
            { $set: { role: newRoleId } },
            { new: true }
        );

        if (!updatedUserRole) {
            return res.status(404).json({ message: "User is not a member of the team or team not found" });
        }

        res.status(200).json({ message: "Member role updated successfully", userRole: updatedUserRole });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to update member role", error: error.message });
    }
};


exports.removeMember = async (req, res) => {
    const { teamId, userId } = req.params;

    try {
        const team = await Team.findById(teamId);
        if (!team) {
            return res.status(404).json({ message: "Team not found" });
        }

        // Check if the user is a member of the team
        const memberIndex = team.members.findIndex(member => member.user.toString() === userId);
        if (memberIndex === -1) {
            return res.status(404).json({ message: "User not found in team" });
        }

        // Remove the user from the team
        team.members.splice(memberIndex, 1);
        await team.save();

        // Remove the UserRole associated with this user and team
        await UserRole.findOneAndRemove({ user: userId, team: teamId });

        res.status(200).json({ message: "Member removed from team successfully", team });
    } catch (error) {
        res.status(500).json({ message: "Failed to remove member from team", error });
    }
};

exports.updateTeam = async (req, res) => {
    const { teamId } = req.params;
    const { name, description } = req.body;

    try {
        const team = await Team.findById(teamId);
        if (!team) {
            return res.status(404).json({ message: "Team not found" });
        }

        team.name = name || team.name;
        team.description = description || team.description;


        await team.save();
        res.status(200).json({ message: "Team updated successfully", team });
    } catch (error) {
        res.status(500).json({ message: "Failed to update team", error: error.message });
    }
};

exports.assignTeamToProject = async (req, res) => {
    const { teamId, projectId } = req.body;

    try {
        // Find the team and project, and ensure they exist
        const team = await Team.findById(teamId).populate('members.user');
        const project = await Project.findById(projectId);

        if (!team || !project) {
            return res.status(404).json({ message: "Team or Project not found" });
        }

        // Check if the team is already assigned to this project
        if (team.projects.includes(projectId)) {
            return res.status(409).json({ message: "Team is already assigned to this project" });
        }

        // Add the project to the team's project list and save the team
        team.projects.push(projectId);
        await team.save();

        // Update UserRole entries for each team member for the project context
        for (const member of team.members) {
            // Find or create a UserRole for the team member in the project context
            let userRole = await UserRole.findOne({ user: member.user._id, project: projectId });
            if (!userRole) {
                userRole = new UserRole({
                    user: member.user._id,
                    role: member.role, // Use the member's role within the team
                    project: projectId,
                    team: teamId
                });
            } else {
                userRole.role = member.role;
            }
            await userRole.save();
        }

        res.status(200).json({ message: "Team assigned to project successfully", team });
    } catch (error) {
        res.status(500).json({ message: "Failed to assign team to project", error: error.message });
    }
};


exports.getTeamDetails = async (req, res) => {
    const { teamId } = req.params;

    try {
        const team = await Team.findById(teamId).populate('members.user', 'name email').populate('projects');
        if (!team) {
            return res.status(404).json({ message: "Team not found" });
        }

        res.status(200).json(team);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch team details", error: error.message });
    }
};
