const mongoose = require('mongoose');
const actions = require('../utils/actions');

const permissionSchema = new mongoose.Schema({
    action: {
        type: String,
        required: true,
        unique: true,
        enum: Object.values(actions),
    },
    description: {
        type: String,
        required: true,
    },
});

const Permission = mongoose.model('Permission', permissionSchema);

module.exports = Permission;
