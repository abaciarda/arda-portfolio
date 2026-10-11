import { execFileSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";
import ts from "typescript";

execFileSync(
  process.execPath,
  ["node_modules/sanity/bin/sanity", "typegen", "generate"],
  { stdio: "inherit" },
);
const path = "../app/sanity/schema.types.ts";
const source = readFileSync(path, "utf8");
const scanner = ts.createScanner(
  ts.ScriptTarget.Latest,
  false,
  ts.LanguageVariant.Standard,
  source,
);
const ranges = [];
while (scanner.scan() !== ts.SyntaxKind.EndOfFileToken) {
  if (
    [
      ts.SyntaxKind.SingleLineCommentTrivia,
      ts.SyntaxKind.MultiLineCommentTrivia,
    ].includes(scanner.getToken())
  )
    ranges.push([scanner.getTokenPos(), scanner.getTextPos()]);
}
let cleaned = source;
for (const [start, end] of ranges.reverse())
  cleaned = cleaned.slice(0, start) + cleaned.slice(end);
writeFileSync(path, cleaned.trimStart());
