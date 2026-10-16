import express from 'express';
import axios from 'axios';
import Project from '../models/Project.js';
import { syncGitHubRepos } from '../services/githubSync.js';

const router = express.Router();

// @route   GET /api/projects/pinned
// @desc    Fetch pinned repositories from GitHub GraphQL API
// @access  Public
router.get('/pinned', async (req, res) => {
  const username = process.env.GITHUB_USERNAME || 'y-kanchan';
  const token    = process.env.GITHUB_TOKEN;

  const query = `
    {
      user(login: "${username}") {
        pinnedItems(first: 6, types: [REPOSITORY]) {
          nodes {
            ... on Repository {
              name
              description
              url
              homepageUrl
              stargazerCount
              primaryLanguage { name }
              repositoryTopics(first: 10) {
                nodes { topic { name } }
              }
            }
          }
        }
      }
    }
  `;

  try {
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `bearer ${token}`;

    const response = await axios.post(
      'https://api.github.com/graphql',
      { query },
      { headers }
    );

    const pinnedItems = response.data?.data?.user?.pinnedItems?.nodes ?? [];

    const formatted = pinnedItems.map((repo, i) => ({
      _id:         `pinned-${i}`,
      name:        repo.name,
      description: repo.description || '',
      htmlUrl:     repo.url,
      homepage:    repo.homepageUrl || '',
      stars:       repo.stargazerCount,
      languages:   repo.primaryLanguage ? [repo.primaryLanguage.name] : [],
      topics:      repo.repositoryTopics.nodes.map(n => n.topic.name),
      isFeatured:  true,
    }));

    res.json(formatted);
  } catch (error) {
    console.error('[Pinned] GitHub GraphQL error:', error.message);
    res.status(500).json({ message: 'Failed to fetch pinned repositories.' });
  }
});



// @route   GET /api/projects
// @desc    Get all projects (sorted by featured, then stars, then update date)
// @access  Public
router.get('/', async (req, res) => {
  try {
    const projects = await Project.find({ isHidden: { $ne: true } })
      .sort({ isFeatured: -1, stars: -1, updatedAt: -1 });
    
    // Format projects to merge custom overrides if present
    const formattedProjects = projects.map(proj => {
      const p = proj.toObject();
      return {
        _id: p._id,
        githubId: p.githubId,
        name: p.customName || p.name,
        description: p.customDescription || p.description,
        htmlUrl: p.htmlUrl,
        homepage: p.homepage,
        stars: p.stars,
        languages: p.languages,
        topics: p.topics,
        updatedAt: p.updatedAt,
        isFeatured: p.isFeatured,
        customImage: p.customImage,
        originalName: p.name,
        originalDescription: p.description
      };
    });

    res.json(formattedProjects);
  } catch (error) {
    console.error(`Error fetching projects: ${error.message}`);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/projects/sync
// @desc    Manually trigger GitHub sync
// @access  Public (Can be protected if needed)
router.post('/sync', async (req, res) => {
  try {
    await syncGitHubRepos();
    res.json({ message: 'GitHub synchronization completed successfully.' });
  } catch (error) {
    res.status(500).json({ message: `Sync failed: ${error.message}` });
  }
});

// @route   PATCH /api/projects/:id/override
// @desc    Update project custom overrides (featured, description, name, image, hidden)
// @access  Public (For developer configuration, in production this should have authentication)
router.patch('/:id/override', async (req, res) => {
  const { isFeatured, customName, customDescription, customImage, isHidden } = req.body;
  
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    if (isFeatured !== undefined) project.isFeatured = isFeatured;
    if (customName !== undefined) project.customName = customName;
    if (customDescription !== undefined) project.customDescription = customDescription;
    if (customImage !== undefined) project.customImage = customImage;
    if (isHidden !== undefined) project.isHidden = isHidden;

    const updatedProject = await project.save();
    res.json(updatedProject);
  } catch (error) {
    console.error(`Error updating overrides: ${error.message}`);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/projects/manual
// @desc    Add a manual project not hosted on GitHub
// @access  Public
router.post('/manual', async (req, res) => {
  const { name, description, htmlUrl, homepage, languages, topics, isFeatured, customImage } = req.body;

  if (!name) {
    return res.status(400).json({ message: 'Name is required' });
  }

  try {
    const project = new Project({
      name,
      description,
      htmlUrl,
      homepage,
      languages: languages || [],
      topics: topics || [],
      isFeatured: isFeatured || false,
      customImage,
      updatedAt: new Date()
    });

    const savedProject = await project.save();
    res.status(201).json(savedProject);
  } catch (error) {
    console.error(`Error creating manual project: ${error.message}`);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
