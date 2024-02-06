const mongoose = require('mongoose');

const reviewInstanceSchema = new mongoose.Schema({
    project: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project',
        required: true
    },
    article: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Article',
        required: true
    },
    reviewer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    reviewStatus: {
        type: String,
        enum: ['pending', 'accepted', 'rejected'],
        default: 'pending'
    },
    reviewStage: {
        type: String,
        enum: ['titleReview', 'abstractReview', 'fullArticleReview'],
        required: true
    }
});

module.exports = mongoose.model('ReviewInstance', reviewInstanceSchema);
