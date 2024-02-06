const ReviewInstance = require('../models/ReviewInstance');
const Project = require('../models/Project');
const Article = require('../models/Article');
const User = require('../models/User');

exports.createReviewInstance = async (req, res) => {
    const { projectId, articleId, reviewerId, reviewStage } = req.body;

    try {
        const project = await Project.findById(projectId);
        const article = await Article.findById(articleId);
        const reviewer = await User.findById(reviewerId);

        if (!project || !article || !reviewer) {
            return res.status(404).json({ message: "Project, Article, or Reviewer not found" });
        }

        const reviewInstance = new ReviewInstance({
            project: projectId,
            article: articleId,
            reviewer: reviewerId,
            reviewStage,
            reviewStatus: 'pending'
        });

        await reviewInstance.save();
        res.status(201).json({ message: "Review Instance created successfully", reviewInstance });
    } catch (error) {
        res.status(500).json({ message: "Failed to create review instance", error: error.message });
    }
};

exports.updateReviewStatus = async (req, res) => {
    const { reviewInstanceId, reviewStatus } = req.body;

    try {
        const reviewInstance = await ReviewInstance.findById(reviewInstanceId);

        if (!reviewInstance) {
            return res.status(404).json({ message: "Review Instance not found" });
        }

        reviewInstance.reviewStatus = reviewStatus;
        await reviewInstance.save();
        res.status(200).json({ message: "Review status updated successfully", reviewInstance });
    } catch (error) {
        res.status(500).json({ message: "Failed to update review status", error: error.message });
    }
};

exports.aggregateReviewResults = async (req, res) => {
    const { projectId } = req.params;

    try {
        const project = await Project.findById(projectId).populate({
            path: 'studies',
            populate: {
                path: 'reviews',
                model: 'ReviewInstance'
            }
        });

        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }

        // to do later ( Logic to aggregate review results for each study)

        res.status(200).json({ message: "Review results aggregated successfully", project });
    } catch (error) {
        res.status(500).json({ message: "Failed to aggregate review results", error: error.message });
    }
};

exports.getReviewDetails = async (req, res) => {
    const { reviewInstanceId } = req.params;

    try {
        const reviewInstance = await ReviewInstance.findById(reviewInstanceId)
            .populate('reviewer', 'name email')
            .populate('article', 'title authors');

        if (!reviewInstance) {
            return res.status(404).json({ message: "Review Instance not found" });
        }

        res.status(200).json({ reviewInstance });
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch review details", error: error.message });
    }
};


