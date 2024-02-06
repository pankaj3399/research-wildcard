const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userRoleSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    role: {
        type: Schema.Types.ObjectId,
        ref: 'Role',
        required: true
    },
    project: {
        type: Schema.Types.ObjectId,
        ref: 'Project',
    },
    team: {
        type: Schema.Types.ObjectId,
        ref: 'Team',
    },
}, { timestamps: true });

userRoleSchema.pre('validate', function(next) {
    if (!this.project && !this.team && !['Admin', 'SuperAdmin'].includes(this.role.name)) {
        next(new Error('A role must be associated with either a project or a team.'));
    } else {
        next();
    }
});

const UserRole = mongoose.model('UserRole', userRoleSchema);
module.exports = UserRole;
