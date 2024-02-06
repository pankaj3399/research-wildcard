const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: { type: String, required: true, minlength: 2 },
    email: {
        type: String, required: true, unique: true,
        lowercase: true, trim: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    },
    password: { type: String, required: true, minlength: 8 },

});

const User = mongoose.model('User', userSchema);
module.exports = User;
