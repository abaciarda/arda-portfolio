const headers = {
  Accept: "application/vnd.github+json",
  "X-GitHub-Api-Version": "2026-03-10",
  "User-Agent": "arda-portfolio",
};
const token = process.env.OCTOKIT_TOKEN;
if (token) {
  const response = await fetch(
    "https://api.github.com/repos/abaciarda/arda-portfolio/commits?per_page=1",
    { headers: { ...headers, Authorization: `Bearer ${token}` } },
  );
  console.log(JSON.stringify({ configuredTokenStatus: response.status }));
} else console.log("No GitHub token configured.");
const response = await fetch(
  "https://api.github.com/users/abaciarda/events/public?per_page=100",
  { headers },
);
const events = await response.json();
console.log(
  JSON.stringify(
    {
      publicFeedStatus: response.status,
      pushEvents: Array.isArray(events)
        ? events.filter((event) => event.type === "PushEvent" && event.public)
            .length
        : 0,
      repositories: Array.isArray(events)
        ? [
            ...new Set(
              events
                .filter((event) => event.type === "PushEvent" && event.public)
                .map((event) => event.repo.name),
            ),
          ]
        : [],
    },
    null,
    2,
  ),
);
