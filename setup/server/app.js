//import modules
const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const cors = require('cors');
require('dotenv').config();
const bcrypt = require('bcrypt');
const validator = require('validator');
const projectRoutes = require('./routes/projectRoutes'); // Adjust the path based on your file structure
const Study = require('./models/Article');
const userRoutes = require('./routes/userRoutes'); // Adjust the path as necessary
const reviewInstanceRoutes = require('./routes/reviewInstanceRoutes');
const app = express();
const teamRoutes = require('./routes/teamRoutes'); // Adjust the path as necessary
const userRoleRoutes = require('./routes/userRoleRoutes'); // Adjust the path as necessary
const roleRoutes = require('./routes/roleRoutes'); // Adjust the path as necessary
const loginRoutes = require('./routes/loginRoutes'); // Adjust the path as necessary


//db
mongoose.connect(process.env.MONG_URI)
  .then(() => console.log('DB connected'))
  .catch(err => console.error('MongoDB connection error:', err));


app.use(express.json()); // Middleware to parse JSON bodies




//middleware
app.use(morgan('dev'));
app.use(cors({ origin: true, credentials: true}));
app.use(express.json());
//error handling middleware
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'An error occurred' });
});

//routes
app.use('/project', projectRoutes);
app.use('/api', projectRoutes);
app.use('/api/reviewInstances', reviewInstanceRoutes);
app.use(express.json());
app.use('/api/userRoles', userRoleRoutes);
app.use('/api', teamRoutes);
app.use('/api', roleRoutes);
app.use('/api', userRoutes);
app.use('/api', loginRoutes);
app.use('/uploads', express.static('uploads'));




const port = process.env.PORT || 3000;

//listener

const server = app.listen(port, () => 
  console.log(`Server is running on port ${port}`));