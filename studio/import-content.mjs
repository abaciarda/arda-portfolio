import { getCliClient } from "sanity/cli";

const config = getCliClient().config();
if (config.projectId !== "w78zoc2a" || config.dataset !== "production")
  throw new Error("The CLI must target w78zoc2a/production.");
process.env.NEXT_PUBLIC_SANITY_PROJECT_ID = config.projectId;
process.env.NEXT_PUBLIC_SANITY_DATASET = config.dataset;
process.env.SANITY_API_WRITE_TOKEN = config.token || "";
await import("../migration/import.mjs");
