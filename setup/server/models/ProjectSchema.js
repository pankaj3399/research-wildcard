const mongoose = require('mongoose');
const projectSchema = new mongoose.Schema({
    title: {
        type: String,
        trim: true,
        required: 'Title is required'
    },
    description: String,
    startDate: {
        type: String,
        trim: true
    }, 
    owner: {
        type: mongoose.Schema.ObjectId,
        ref: 'Employee',
        required: false
    },
    collaborators: [{
        type: mongoose.Schema.ObjectId,
        ref: 'Employee',
        required: false
    }],
    studies: [{
        type: mongoose.Schema.ObjectId,
        ref: 'Study',
        required: false
    }],
    // Client note* Add other fields for study if required
});
module.exports=mongoose.model('Project', projectSchema);


