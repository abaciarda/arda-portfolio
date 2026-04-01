import { Octokit } from "octokit";
import { env } from "../env";
import { unstable_cache } from "next/cache";

const octokit = new Octokit({ auth: env.OCTOKIT_TOKEN });

export const getLatestCommits = unstable_cache(async () => {
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
        date: new Date(
          commit.commit.author?.date || new Date(),
        ).toLocaleDateString("tr-TR", { day: "2-digit", month: "short" }),
        sha: commit.sha,
      };
    })
    .slice(0, 2);

  return commitsMap;
}, ["latest-commits"], { tags: ["github-commits"], revalidate: 14400});
