import test from "node:test";
import assert from "node:assert/strict";
import { loadGitHubActivity } from "../app/lib/github-activity";

const sha = (value: string) => value.repeat(40);
const event = (repo: string, head: string, date = "2026-10-11T09:00:00Z") => ({
  type: "PushEvent",
  public: true,
  actor: { login: "abaciarda" },
  repo: { name: repo },
  payload: { head },
  created_at: date,
});

test("activity covers multiple repositories and uses current push heads", async () => {
  const calls: string[] = [];
  const result = await loadGitHubActivity({
    username: "abaciarda",
    request: async (url) => {
      calls.push(url);
      if (url.includes("/events/public"))
        return Response.json([
          event("abaciarda/second", sha("b")),
          event("abaciarda/first", sha("a"), "2026-10-10T09:00:00Z"),
        ]);
      return Response.json({
        commit: {
          message: url.endsWith(sha("b"))
            ? "Second project commit"
            : "First project commit",
        },
      });
    },
  });
  assert.deepEqual(
    result.map((item) => item.repo),
    ["abaciarda/second", "abaciarda/first"],
  );
  assert.equal(result[0].message, "Second project commit");
  assert.equal(
    result[0].url,
    `https://github.com/abaciarda/second/commit/${sha("b")}`,
  );
  assert.equal(calls.length, 3);
});

test("invalid tokens retry anonymously and are omitted from commit requests", async () => {
  const authorizations: (string | undefined)[] = [];
  const result = await loadGitHubActivity({
    username: "abaciarda",
    token: "invalid-test-token",
    request: async (url, options) => {
      const authorization = (options.headers as Record<string, string>)
        .Authorization;
      authorizations.push(authorization);
      if (authorization)
        return Response.json({ message: "Bad credentials" }, { status: 401 });
      return url.includes("/events/public")
        ? Response.json([event("abaciarda/repo", sha("a"))])
        : Response.json({ commit: { message: "Public commit" } });
    },
  });
  assert.equal(result.length, 1);
  assert.deepEqual(authorizations, [
    "Bearer invalid-test-token",
    undefined,
    undefined,
  ]);
});

test("private, unrelated, malformed, and duplicate events are excluded", async () => {
  let commitRequests = 0;
  const result = await loadGitHubActivity({
    username: "abaciarda",
    request: async (url) => {
      if (url.includes("/events/public"))
        return Response.json([
          event("abaciarda/public", sha("a")),
          event("abaciarda/public", sha("a")),
          { ...event("abaciarda/private", sha("b")), public: false },
          {
            ...event("abaciarda/other-user", sha("c")),
            actor: { login: "someone-else" },
          },
          event("abaciarda/deleted-branch", sha("0")),
          event("../unsafe/path", sha("d")),
          { ...event("abaciarda/issues", sha("e")), type: "IssuesEvent" },
        ]);
      commitRequests++;
      return Response.json({ commit: { message: "Public commit" } });
    },
  });
  assert.equal(result.length, 1);
  assert.equal(commitRequests, 1);
});

test("a deleted commit does not prevent other repository activity from displaying", async () => {
  const result = await loadGitHubActivity({
    username: "abaciarda",
    request: async (url) => {
      if (url.includes("/events/public"))
        return Response.json([
          event("abaciarda/deleted", sha("a")),
          event("abaciarda/available", sha("b")),
        ]);
      if (url.includes("/deleted/")) return Response.json({}, { status: 404 });
      return Response.json({ commit: { message: "Available commit" } });
    },
  });
  assert.equal(result.length, 1);
  assert.equal(result[0].repo, "abaciarda/available");
});

test("valid token is retained and public rate limits are surfaced as failures", async () => {
  await assert.rejects(
    loadGitHubActivity({
      username: "abaciarda",
      token: "valid-test-token",
      request: async (_url, options) => {
        assert.equal(
          (options.headers as Record<string, string>).Authorization,
          "Bearer valid-test-token",
        );
        return Response.json({}, { status: 403 });
      },
    }),
    /HTTP 403/,
  );
});
