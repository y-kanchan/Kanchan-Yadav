import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema(
  {
    githubId: {
      type: Number,
      unique: true,
      sparse: true // Allows manual projects that don't have a githubId
    },
    name: {
      type: String,
      required: true
    },
    description: {
      type: String
    },
    htmlUrl: {
      type: String
    },
    homepage: {
      type: String
    },
    stars: {
      type: Number,
      default: 0
    },
    languages: {
      type: [String],
      default: []
    },
    topics: {
      type: [String],
      default: []
    },
    updatedAt: {
      type: Date
    },
    
    // Custom Overrides (Survivable through auto-sync updates)
    isFeatured: {
      type: Boolean,
      default: false
    },
    customName: {
      type: String
    },
    customDescription: {
      type: String
    },
    customImage: {
      type: String // URL or path to custom preview image
    },
    isHidden: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

const Project = mongoose.model('Project', projectSchema);

export default Project;
