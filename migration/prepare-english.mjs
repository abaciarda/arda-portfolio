import { writeFileSync } from "node:fs";
import { englishContent } from "./english.mjs";

writeFileSync(
  new URL("./source/content.en.json", import.meta.url),
  JSON.stringify(englishContent, null, 2) + "\n",
);
console.log(
  "Prepared English translations for the profile, settings, seven projects, and the complete article.",
);
