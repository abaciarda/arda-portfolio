import { defineCliConfig } from "sanity/cli";

export default defineCliConfig({
  api: { projectId: "w78zoc2a", dataset: "production" },
  deployment: { autoUpdates: true, appId: "gn410jypo92shpniyr25vfqx" },
  typegen: {
    path: "../app/**/*.{ts,tsx}",
    schema: "./schema.json",
    generates: "../app/sanity/schema.types.ts",
    overloadClientMethods: false,
  },
});
