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
    const files = req.files; // Assuming you're using middleware like multer for file handling

    try {
        const project = await Project.findById(projectId);
        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }

        // Process PubMed IDs
        if (pubmedIds) {
            const ids = pubmedIds.split(',').map(id => id.trim());
            for (const id of ids) {
                const studyDetails = await fetchStudyFromPubMed(id);
if (studyDetails) {
    const { title, authors, pubdate, abstract } = studyDetails;
    const newArticle = new Article({
        title,
        authors,
        publicationDate: pubdate,
        abstract, // Storing the abstract
        documentType: 'pubmed',
        projectId: projectId
    });
    await newArticle.save();
    project.studies.push(newArticle._id);
} else {
    console.log(`No data found for PubMed ID: ${id}`);
}
            }
        }

        // Process file uploads
        if (files && files.length > 0) {
            for (const file of files) {
                
                const newArticle = new Article({
                    title: file.originalname, // Placeholder, adjust as needed
                    documentLink: file.path,
                    documentType: 'pdf',
                    projectId: projectId 
                });
                await newArticle.save();
                project.studies.push(newArticle._id);
            }
        }

        await project.save();
        res.status(200).json({ message: "Articles imported successfully", project });
    } catch (error) {
        console.error(`Failed to import articles for project ${projectId}:`, error);
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

//fetch all studies for a project
exports.getStudies = async (req, res) => {
    const { projectId } = req.params;

    try {
        const project = await
        Project.findById(projectId)
        .populate('studies');
        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }
        res.status(200).json({ message: "Studies fetched successfully", studies: project.studies });
    }
    catch (error) {
        res.status(500).json({ message: "Failed to fetch studies", error: error.message });
    }
}

exports.getProjects = async (req, res) => {
    try {
        const projects = await Project.find();
        res.status(200).json({ message: "Projects fetched successfully", projects });
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch projects", error: error.message });
    }
}

exports.getProjectById = async (req, res) => {
    const { projectId } = req.params;

    try {
        const project = await
        Project.findById(projectId);
        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }
        res.status(200).json({ message: "Project fetched successfully", project });
    }
    catch (error) {
        res.status(500).json({ message: "Failed to fetch project", error: error.message });
    }
}




