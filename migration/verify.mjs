import { createClient } from "@sanity/client";

const client = createClient({
  projectId: "w78zoc2a",
  dataset: "production",
  apiVersion: "2026-02-01",
  useCdn: false,
});
const summary = await client.fetch(`{
  "posts": count(*[_type == "post"]),
  "projects": count(*[_type == "project"]),
  "profile": count(*[_type == "profile" && _id == "profile"]),
  "settings": count(*[_type == "siteSettings" && _id == "siteSettings"]),
  "brokenAuthors": count(*[_type == "post" && !defined(author->._id)])
}`);
console.log(JSON.stringify(summary, null, 2));
