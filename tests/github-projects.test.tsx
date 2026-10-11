import assert from "node:assert/strict";
import test from "node:test";
import {
  loadGitHubProjects,
  resolveHomepageProjects,
} from "../app/lib/github-projects";

test("GitHub projects show five distinct public owned repositories ordered by push date", async () => {
  const repo = (id: number, overrides = {}) => ({
    id,
    name: `repo-${id}`,
    full_name: `abaciarda/repo-${id}`,
    private: false,
    pushed_at: `2026-10-0${id}T12:00:00Z`,
    ...overrides,
  });
  const projects = await loadGitHubProjects({
    username: "abaciarda",
    request: async (url, options) => {
      assert.ok(url.includes("sort=pushed&direction=desc"));
      assert.equal(options.next?.revalidate, 300);
      return Response.json([
        repo(1),
        repo(3),
        repo(2),
        repo(5),
        repo(4),
        repo(6),
        repo(7, { private: true }),
        repo(8, { full_name: "someone/repo-8" }),
        repo(9, { pushed_at: null }),
      ]);
    },
  });
  assert.deepEqual(
    projects.map((project) => project.title),
    ["repo-6", "repo-5", "repo-4", "repo-3", "repo-2"],
  );
  assert.equal(projects[0].href, "https://github.com/abaciarda/repo-6");
});

test("invalid token retries GitHub projects anonymously", async () => {
  const authorization: (string | null)[] = [];
  await loadGitHubProjects({
    username: "abaciarda",
    token: "expired",
    request: async (_, options) => {
      authorization.push(new Headers(options.headers).get("Authorization"));
      return authorization.length === 1
        ? new Response(null, { status: 401 })
        : Response.json([]);
    },
  });
  assert.deepEqual(authorization, ["Bearer expired", null]);
});

test("default manual mode keeps editorial order and never contacts GitHub", async () => {
  const projects = Array.from({ length: 8 }, (_, index) => ({
    _id: String(index),
    title: String(index),
    date: "2026",
    featured: index !== 0,
  }));
  const result = await resolveHomepageProjects({
    projects,
    loadRepositories: async () => {
      throw new Error("must not be called");
    },
  });
  assert.equal(result.source, "featured");
  assert.deepEqual(
    result.projects.map((project) => project._id),
    ["1", "2", "3", "4", "5"],
  );
});

test("GitHub outage falls back to selected projects and retains their display dates", async () => {
  const project = {
    _id: "selected",
    title: "Selected",
    date: "2025 – 2026",
    featured: true,
  };
  const result = await resolveHomepageProjects({
    source: "github",
    projects: [project],
    loadRepositories: () =>
      loadGitHubProjects({
        username: "abaciarda",
        request: async () => new Response(null, { status: 403 }),
      }),
  });
  assert.deepEqual(result, { projects: [project], source: "featured" });
});
