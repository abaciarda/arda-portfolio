import { loadGitHubProjects } from "../app/lib/github-projects";

const projects = await loadGitHubProjects({
  username: "abaciarda",
  token: process.env.OCTOKIT_TOKEN,
});
if (projects.length !== 5) throw new Error("Expected five public repositories.");
console.log(JSON.stringify(projects, null, 2));
