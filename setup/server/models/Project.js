const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const projectSchema = new Schema({
  title: {
    type: String,
    trim: true,
    required: "Title is required",
  },
  description: String,
  startDate: {
    type: Date,
    required: "Start date is required",
    default: Date.now,
  },
  collaborators: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
      role: {
        type: String,
        enum: ["collaborator", "reviewer", "projectManager"],
        default: "collaborator",
      },
    },
  ],
  teams: [
    {
      type: Schema.Types.ObjectId,
      ref: "Team",
    },
  ],
  studies: [
    {
      type: Schema.Types.ObjectId,
      ref: "Article",
    },
  ],
  stages: {
    titleReview: {
      status: {
        type: String,
        enum: ["pending", "completed"],
        default: "pending",
      },
      deadline: Date,
    },
    abstractReview: {
      status: {
        type: String,
        enum: ["pending", "completed"],
        default: "pending",
      },
      deadline: Date,
    },
    fullArticleReview: {
      status: {
        type: String,
        enum: ["pending", "completed"],
        default: "pending",
      },
      deadline: Date,
    },
  },
  flaggedDuplicates: [{ type: Schema.Types.ObjectId, ref: "Article" }],
  inclusion: [{ type: String }],
  exclusion: [{ type: String }],
});

module.exports = mongoose.model("Project", projectSchema);
