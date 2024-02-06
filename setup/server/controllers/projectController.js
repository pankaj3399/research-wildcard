const Project = require('../models/Project');
const ReviewInstance = require('../models/ReviewInstance');
const User = require('../models/User');
const Article = require('../models/Article');
const fetchStudyFromPubMed = require('../utils/fetchStudyFromPubMed');



// Create a new project with initialized review stages
exports.createProject = async (req, res) => {
    const { title, description, startDate, collaborators } = req.body;

    try {
        const newProject = new Project({
            title,
            description,
            startDate,
            collaborators: collaborators || [],
            stages: {
                titleReview: { status: 'pending' },
                abstractReview: { status: 'pending' },
                fullArticleReview: { status: 'pending' }
            }
        });

        await newProject.save();
        res.status(201).json({ message: "Project created successfully", project: newProject });
    } catch (error) {
        res.status(500).json({ message: "Failed to create project", error: error.message });
    }
};



exports.importArticles = async (req, res) => {
    const { projectId } = req.params;
    const { pubmedIds } = req.body;
    const files = req.files;

    try {
        const project = await Project.findById(projectId);
        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }

        // Process PubMed IDs
        if (pubmedIds) {
            for (const pubmedId of pubmedIds) {
                const studyDetails = await fetchStudyFromPubMed(pubmedId);
                if (studyDetails) {
                    const { title, authors, pubdate } = studyDetails;
                    const newArticle = new Article({
                        title,
                        authors,
                        publicationDate: pubdate,
                        documentType: 'pubmed'
                    });
                    await newArticle.save();
                    project.studies.push(newArticle._id);
                } else {
                    // Handling error
                }
            }
        }

        // Process file uploads
        if (files) {
            for (const file of files) {
                //to do: extract metadata from the file
                const metadata = {}; // to do later( replace with real metadata)
                const newArticle = new Article({
                    // ...metadata,
                    documentLink: file.path,
                    documentType: file.mimetype.includes('pdf') ? 'pdf' : 'xml'
                });

                await newArticle.save();
                project.studies.push(newArticle._id);
            }
        }

        await project.save();
        res.status(200).json({ message: "Articles imported successfully", project });
    } catch (error) {
        res.status(500).json({ message: "Failed to import articles", error: error.message });
    }
};




// Update an article's review status within a project
exports.updateArticleReviewStatus = async (req, res) => {
    const { articleId, reviewStatus, projectId } = req.body;

    try {
        // Find the review instance for this article within the project
        const reviewInstance = await ReviewInstance.findOne({ article: articleId, project: projectId });

        if (!reviewInstance) {
            return res.status(404).json({ message: "Review instance not found for this article and project" });
        }

        reviewInstance.reviewStatus = reviewStatus;
        await reviewInstance.save();

        res.status(200).json({ message: "Article review status updated successfully", reviewInstance });
    } catch (error) {
        res.status(500).json({ message: "Failed to update article review status", error: error.message });
    }
};
exports.assignArticleToReviewer = async (req, res) => {
    const { projectId, articleId, reviewerId, reviewStage } = req.body;

    try {
        const projectExists = await Project.findById(projectId);
        const articleExists = await Article.findById(articleId);
        const reviewerExists = await User.findById(reviewerId);

        if (!projectExists || !articleExists || !reviewerExists) {
            return res.status(404).json({ message: "Project, Article, or Reviewer not found" });
        }

        const newReviewInstance = new ReviewInstance({
            project: projectId,
            article: articleId,
            reviewer: reviewerId,
            reviewStatus: 'pending',
            reviewStage: reviewStage
        });

        await newReviewInstance.save();
        res.status(201).json({ message: "Article assigned to reviewer successfully", reviewInstance: newReviewInstance });
    } catch (error) {
        res.status(500).json({ message: "Failed to assign article to reviewer", error: error.message });
    }
};

// Update the status of a review stage within a project
exports.updateReviewStageStatus = async (req, res) => {
    const { projectId, stage, status } = req.body;

    try {
        const project = await Project.findById(projectId);
        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }

        if (!project.stages[stage]) {
            return res.status(400).json({ message: "Invalid review stage" });
        }

        // Update the status of the specified stage
        project.stages[stage].status = status;
        await project.save();

        res.status(200).json({ message: "Review stage status updated successfully", project });
    } catch (error) {
        res.status(500).json({ message: "Failed to update review stage status", error: error.message });
    }
};

// Add a collaborator to a project
exports.addCollaborator = async (req, res) => {
    const { projectId, collaboratorId } = req.body;

    try {
        const project = await Project.findById(projectId);
        const collaborator = await User.findById(collaboratorId);

        if (!project || !collaborator) {
            return res.status(404).json({ message: "Project or User not found" });
        }

        if (project.collaborators.includes(collaboratorId)) {
            return res.status(409).json({ message: "User is already a collaborator" });
        }

        project.collaborators.push(collaboratorId);
        await project.save();

        res.status(200).json({ message: "Collaborator added successfully", project });
    } catch (error) {
        res.status(500).json({ message: "Failed to add collaborator", error: error.message });
    }
};

// Delete a project
exports.deleteProject = async (req, res) => {
    const { projectId } = req.params;

    try {
        const deletedProject = await Project.findByIdAndDelete(projectId);
        if (!deletedProject) {
            return res.status(404).json({ message: "Project not found" });
        }



        res.status(200).json({ message: "Project deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Failed to delete project", error: error.message });
    }
};


