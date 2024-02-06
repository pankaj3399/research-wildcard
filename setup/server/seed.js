require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Role = require('./models/Role');
const Project = require('./models/Project');
const Team = require('./models/Team');
const UserRole = require('./models/UserRole');

async function seedDatabase() {
    await mongoose.connect(process.env.MONG_URI, { useNewUrlParser: true, useUnifiedTopology: true });

    // Create roles
    const roles = await Promise.all([
        new Role({ name: 'Admin' }).save(),
        new Role({ name: 'Reviewer' }).save(),
    ]);

    // Create users
    const users = await Promise.all([
        new User({ name: 'John Doe', email: 'john@example.com', password: 'password123' }).save(),
        new User({ name: 'Jane Doe', email: 'jane@example.com', password: 'password123' }).save(),
    ]);

    // Create projects
    const projects = await Promise.all([
        new Project({ title: 'Project 1', description: 'A test project' }).save(),
    ]);

    // Create teams
    const teams = await Promise.all([
        new Team({ name: 'Team A', description: 'First team' }).save(),
    ]);

    await new UserRole({ user: users[0]._id, role: roles[0]._id, project: projects[0]._id }).save();

    console.log('Database seeded!');
    mongoose.connection.close();
}

seedDatabase().catch((error) => {
    console.error('Failed to seed database:', error);
    mongoose.connection.close();
});
