const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const teamMemberSchema = new Schema({
    userRole: {
        type: Schema.Types.ObjectId,
        ref: 'UserRole',
        required: true
    }
}, { _id: false });

const teamSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: String,
    members: [teamMemberSchema],
    projects: [{
        type: Schema.Types.ObjectId,
        ref: 'Project',
    }]
}, { timestamps: true });

teamSchema.pre('save', function(next) {
    const userRoleIds = this.members.map(member => member.userRole.toString());
    const uniqueUserRoleIds = [...new Set(userRoleIds)];
    if (uniqueUserRoleIds.length !== userRoleIds.length) {
        next(new Error('Duplicate team members detected'));
    } else {
        next();
    }
});

const Team = mongoose.model('Team', teamSchema);
module.exports = Team;
