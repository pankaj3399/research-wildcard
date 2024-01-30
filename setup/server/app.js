//import modules
const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const cors = require('cors');
require('dotenv').config();
const bcrypt = require('bcrypt');
const validator = require('validator');
const projectRoutes = require('./routes/projectRoutes');
const authRoutes = require('./routes/authRoutes');
const Study = require('./models/StudySchema');
const jwt = require('jsonwebtoken');
const { importCSV, importXML, importJSON, importFromAPI } = require('./importData');






//app
const app = express();



//db
mongoose.connect(process.env.MONG_URI)
  .then(() => console.log('DB connected'))
  .catch(err => console.error('MongoDB connection error:', err));


//middleware
app.use(morgan('dev'));
app.use(cors({ origin: true, credentials: true}));
app.use(express.json());
//error handling middleware
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'An error occurred' });
});

//Authentication middleware
app.use(async (req, res, next) => {
  try {
   
    const authHeader = req.headers.authorization;
    if (authHeader) {
      // Extract the token from the Authorization header
      const token = authHeader.split(' ')[1];
      
      // Verify the token
      const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
      req.user = { _id: decoded._id };
    }
    next();
  } catch (err) {
    res.status(401).json({ message: 'Authentication failed' });
  }
});








//routes
app.use('/auth', authRoutes);
app.use('/project', projectRoutes);


//port
const port = process.env.PORT || 3000;

//listener

const server = app.listen(port, () => 
  console.log(`Server is running on port ${port}`));
