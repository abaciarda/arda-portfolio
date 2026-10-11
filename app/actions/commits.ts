import { env } from "../env";
import { loadGitHubActivity } from "../lib/github-activity";

export async function getLatestCommits() {
  try {
    return await loadGitHubActivity({
      username: "abaciarda",
      token: env.OCTOKIT_TOKEN,
    });
  } catch (error) {
    console.error(
      "Unable to load GitHub activity",
      error instanceof Error ? error.message : "Unknown error",
    );
    return [];
  }
}
