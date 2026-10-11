import { Octokit } from "octokit";
import { env } from "../env";
import { unstable_cache } from "next/cache";

export const getLatestCommits = unstable_cache(
  async () => {
    if (!env.OCTOKIT_TOKEN) return [];
    const octokit = new Octokit({ auth: env.OCTOKIT_TOKEN });
    try {
      const res = await octokit.request("GET /repos/{owner}/{repo}/commits", {
        owner: "abaciarda",
        repo: "arda-portfolio",
        per_page: 5,
        headers: {
          "X-Github-Api-Version": "2026-03-10",
        },
      });

      const commitsMap = res.data
        .map((commit) => {
          return {
            message: commit.commit.message,
            url: commit.html_url,
            repo: "arda-portfolio",
            date: commit.commit.author?.date || new Date().toISOString(),
            sha: commit.sha,
          };
        })
        .slice(0, 2);

      return commitsMap;
    } catch (error) {
      console.error(
        "Unable to load GitHub activity",
        error instanceof Error ? error.message : "Unknown error",
      );
      return [];
    }
  },
  ["latest-commits"],
  { tags: ["github-commits"], revalidate: 14400 },
);
