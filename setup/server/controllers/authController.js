const bcrypt = require('bcrypt');
const User = require('../models/EmployeeSchema'); 
const validator = require('validator');
const jwt = require('jsonwebtoken');

exports.register = async (req, res, next) => {
  const { name, email, password } = req.body;

  // Input validation
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  if (!validator.isEmail(email)) {
    return res.status(400).json({ error: 'Invalid email format' });
  }

  if (password.length < 8) {
    // Send error message to frontend
    return res.status(400).json({ error: 'Password must be at least 8 characters' });
  }

  // Unique email check
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ error: 'This email is already in use. Please use a different email.' });
  }

  // Create new user
  const hashed_password = bcrypt.hashSync(password, 10);
  const user = new User({ name, email, password: hashed_password });

  // Save user
  const doc = await user.save();
  res.status(200).json({ message: 'User created successfully', user: { name, email } }); 
};

exports.login = async (req, res, next) => {
  const { email, password } = req.body;

  // Input validation
  if (!email || !password) {
    return res.status(400).json({ error: 'Both email and password are required' });
  }

  // Find user by email
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({ error: 'Invalid email or password' });
  }

  // Compare passwords
  const validPassword = await bcrypt.compare (password, user.password);
  if (!validPassword) {
    return res.status(400).json({ error: 'Invalid email or password' });
  }

  // Create and assign token
  const token = jwt.sign({ _id: user._id}, process.env.TOKEN_SECRET);
  res.header('auth-token', token).json({ message: 'Logged in successfully', token });
};