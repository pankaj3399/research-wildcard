const UserRole = require('../models/UserRole');
const User = require("../models/User");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
exports.createUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        
        const hashedPassword = bcrypt.hashSync(password, 10); // Hash the password

        const newUser = new User({
            name,
            email,
            password: hashedPassword
        });

        await newUser.save();
        res.status(201).json({ message: "User created successfully", user: newUser });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to create user", error });
    }
};

// Update user information
exports.updateUser = async (req, res) => {
    const { userId } = req.params;
    const { name, email } = req.body;

    try {
        const updatedUser = await User.findByIdAndUpdate(userId, { name, email }, { new: true });
        res.status(200).json({ message: "User updated successfully", user: updatedUser });
    } catch (error) {
        res.status(500).json({ message: "Failed to update user", error });
    }
};

exports.deleteUser = async (req, res) => {
    const { userId } = req.params;

    try {
        // Optionally, handle UserRole cleanup before deleting the user
        await UserRole.deleteMany({ user: userId });
        await User.findByIdAndDelete(userId);
        res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Failed to delete user", error });
    }
}

// List all users
exports.listUsers = async (req, res) => {
    try {
        const users = await User.find(); // Removed populate('roles') since roles are not directly associated
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch users", error });
    }
}

exports.assignRole = async (req, res) => {
    try {
        const { userId, roleId } = req.body;

        // Check if the user and role exist
        const user = await User.findById(userId);
        const role = await Role.findById(roleId);
        res.status(200).json({ message: "Role assigned successfully" });
        if (!user || !role) {
            return res.status(404).json({ message: "User or Role not found" });
        }
    } catch (error) {
        res.status(500).json({ message: "Failed to assign role", error });
    }
}


