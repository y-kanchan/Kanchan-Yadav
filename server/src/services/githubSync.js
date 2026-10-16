import axios from 'axios';
import cron from 'node-cron';
import dotenv from 'dotenv';
import Project from '../models/Project.js';
import connectDB from '../config/db.js';

dotenv.config();

export const syncGitHubRepos = async () => {
  const username = process.env.GITHUB_USERNAME || 'y-kanchan';
  const token = process.env.GITHUB_TOKEN;

  console.log(`[Sync] Starting GitHub sync for user: ${username}...`);

  try {
    const headers = {
      'User-Agent': 'y-kanchan-portfolio-sync'
    };

    if (token) {
      headers['Authorization'] = `token ${token}`;
      console.log('[Sync] Using GitHub token for authenticated requests.');
    } else {
      console.warn('[Sync] No GITHUB_TOKEN found. Proceeding with unauthenticated request (subject to rate limits).');
    }

    const response = await axios.get(`https://api.github.com/users/${username}/repos?sort=updated&per_page=100`, { headers });
    const repos = response.data;

    if (!Array.isArray(repos)) {
      throw new Error('Unexpected response format from GitHub API');
    }

    console.log(`[Sync] Fetched ${repos.length} repositories from GitHub.`);

    // Filter out forks - only sync original projects
    const originalRepos = repos.filter(repo => !repo.fork);
    console.log(`[Sync] Filtered down to ${originalRepos.length} original (non-fork) repositories.`);

    const syncedIds = [];

    for (const repo of originalRepos) {
      syncedIds.push(repo.id);

      // Prepare standard metadata update
      const updateData = {
        name: repo.name,
        description: repo.description || '',
        htmlUrl: repo.html_url,
        homepage: repo.homepage || '',
        stars: repo.stargazers_count,
        languages: repo.language ? [repo.language] : [],
        topics: repo.topics || [],
        updatedAt: new Date(repo.updated_at)
      };

      // Upsert: Find by githubId. If exists, update metadata; if not, create.
      // Custom overrides (customName, customDescription, isFeatured, customImage, isHidden) are untouched.
      await Project.findOneAndUpdate(
        { githubId: repo.id },
        { 
          $set: updateData,
          $setOnInsert: {
            isFeatured: false,
            isHidden: false
          }
        },
        { upsert: true, new: true }
      );
    }

    // Clean up projects that were previously synced but are no longer in the GitHub response
    // (e.g. repository was deleted or made private on GitHub)
    // We only delete projects that HAVE a githubId, ensuring manually added projects are preserved.
    const deleteResult = await Project.deleteMany({
      githubId: { $exists: true, $nin: syncedIds }
    });

    console.log(`[Sync] GitHub sync complete. Updated/Inserted ${originalRepos.length} repos. Deleted ${deleteResult.deletedCount} outdated synced repos.`);
  } catch (error) {
    console.error(`[Sync] Error syncing GitHub repositories: ${error.message}`);
    if (error.response) {
      console.error(`[Sync] API Response Error: ${JSON.stringify(error.response.data)}`);
    }
  }
};

// Scheduler: Run every 12 hours
export const startSyncScheduler = () => {
  // Cron expression: 0 0 */12 * * * (runs at minute 0, hour 0, 12, etc.)
  cron.schedule('0 0 */12 * * *', async () => {
    console.log('[Sync Scheduler] Scheduled task triggered.');
    await syncGitHubRepos();
  });
  console.log('[Sync Scheduler] GitHub Sync Cron Job registered (every 12 hours).');
};

// If run directly from the command line (e.g., node githubSync.js --manual)
if (process.argv.includes('--manual')) {
  (async () => {
    await connectDB();
    await syncGitHubRepos();
    process.exit(0);
  })();
}
