export interface HomepageProject {
  _id: string;
  title: string;
  href?: string;
  date: string;
}

interface Repository {
  id: number;
  name: string;
  full_name: string;
  private: boolean;
  pushed_at: string | null;
}

type Request = (
  url: string,
  options: RequestInit & {
    next?: { revalidate: number; tags: string[] };
  },
) => Promise<Response>;

export async function loadGitHubProjects({
  username,
  token,
  request = fetch,
}: {
  username: string;
  token?: string;
  request?: Request;
}): Promise<HomepageProject[]> {
  const url = `https://api.github.com/users/${encodeURIComponent(username)}/repos?type=owner&sort=pushed&direction=desc&per_page=100`;
  async function get(accessToken?: string) {
    return request(url, {
      headers: {
        Accept: "application/vnd.github+json",
        "X-GitHub-Api-Version": "2026-03-10",
        "User-Agent": "arda-portfolio",
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      },
      signal: AbortSignal.timeout(8000),
      next: { revalidate: 300, tags: ["github-projects"] },
    });
  }
  const accessToken = token?.trim();
  let response = await get(accessToken);
  if (accessToken && response.status === 401) response = await get();
  if (!response.ok)
    throw new Error(`GitHub projects request failed (HTTP ${response.status})`);
  const repositories = (await response.json()) as Repository[];
  return repositories
    .filter(
      (repo) =>
        repo.private === false &&
        repo.full_name?.split("/")[0].toLowerCase() ===
          username.toLowerCase() &&
        /^[\w.-]+\/[\w.-]+$/.test(repo.full_name) &&
        typeof repo.name === "string" &&
        repo.pushed_at &&
        Number.isFinite(Date.parse(repo.pushed_at)),
    )
    .sort((a, b) => Date.parse(b.pushed_at!) - Date.parse(a.pushed_at!))
    .slice(0, 5)
    .map((repo) => ({
      _id: `github-${repo.id}`,
      title: repo.name,
      href: `https://github.com/${repo.full_name}`,
      date: repo.pushed_at!,
    }));
}

export async function resolveHomepageProjects({
  source,
  projects,
  loadRepositories,
}: {
  source?: "featured" | "github";
  projects: (HomepageProject & { featured: boolean })[];
  loadRepositories: () => Promise<HomepageProject[]>;
}): Promise<{ projects: HomepageProject[]; source: "featured" | "github" }> {
  if (source === "github") {
    try {
      return { projects: await loadRepositories(), source: "github" };
    } catch (error) {
      console.error(
        "Unable to load GitHub projects",
        error instanceof Error ? error.message : "Unknown error",
      );
    }
  }
  return {
    projects: projects.filter((project) => project.featured).slice(0, 5),
    source: "featured",
  };
}
