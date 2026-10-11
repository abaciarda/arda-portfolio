export interface GitHubActivity {
  message: string;
  url: string;
  repo: string;
  date: string;
  sha: string;
}

interface PushEvent {
  type: string;
  public: boolean;
  created_at: string;
  actor?: { login: string };
  repo: { name: string };
  payload: { head?: string };
}

type RequestOptions = RequestInit & {
  next?: { revalidate: number; tags: string[] };
};
type Request = (url: string, options: RequestOptions) => Promise<Response>;

export async function loadGitHubActivity({
  username,
  token,
  request = fetch,
  limit = 5,
}: {
  username: string;
  token?: string;
  request?: Request;
  limit?: number;
}): Promise<GitHubActivity[]> {
  let currentToken = token?.trim() || undefined;
  async function get(path: string, revalidate: number) {
    const headers: Record<string, string> = {
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2026-03-10",
      "User-Agent": "arda-portfolio",
    };
    const options = (): RequestOptions => ({
      headers: {
        ...headers,
        ...(currentToken ? { Authorization: `Bearer ${currentToken}` } : {}),
      },
      signal: AbortSignal.timeout(8000),
      next: { revalidate, tags: ["github-activity"] },
    });
    let response = await request(`https://api.github.com${path}`, options());
    if (currentToken && response.status === 401) {
      currentToken = undefined;
      response = await request(`https://api.github.com${path}`, options());
    }
    if (!response.ok)
      throw new Error(
        `GitHub activity request failed (HTTP ${response.status})`,
      );
    return response.json();
  }

  const events = (await get(
    `/users/${encodeURIComponent(username)}/events/public?per_page=100`,
    300,
  )) as PushEvent[];
  const seen = new Set<string>();
  const pushes = events
    .filter((event) => {
      const sha = event.payload?.head;
      if (
        event.type !== "PushEvent" ||
        event.public !== true ||
        event.actor?.login.toLowerCase() !== username.toLowerCase() ||
        !sha ||
        !/^[a-f0-9]{40}$/i.test(sha) ||
        /^0+$/.test(sha) ||
        !/^[\w.-]+\/[\w.-]+$/.test(event.repo?.name) ||
        !Number.isFinite(Date.parse(event.created_at))
      )
        return false;
      const key = `${event.repo.name}:${sha}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .sort((a, b) => Date.parse(b.created_at) - Date.parse(a.created_at))
    .slice(0, Math.max(0, limit) * 2);

  const results = await Promise.allSettled(
    pushes.map(async (event): Promise<GitHubActivity> => {
      const sha = event.payload.head!;
      const path = event.repo.name.split("/").map(encodeURIComponent).join("/");
      const commit = (await get(`/repos/${path}/commits/${sha}`, 86400)) as {
        commit: { message: string };
      };
      return {
        message: commit.commit.message,
        url: `https://github.com/${path}/commit/${sha}`,
        repo: event.repo.name,
        date: event.created_at,
        sha,
      };
    }),
  );
  return results
    .flatMap((result) => (result.status === "fulfilled" ? [result.value] : []))
    .slice(0, Math.max(0, limit));
}
