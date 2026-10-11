import { loadGitHubActivity } from '../app/lib/github-activity';

const result = await loadGitHubActivity({ username: 'abaciarda', token: process.env.OCTOKIT_TOKEN });
if (!result.length) throw new Error('GitHub returned no usable public activity.');
console.log(JSON.stringify(result.map((item) => ({ repo: item.repo, message: item.message.split('\n')[0], date: item.date })), null, 2));
