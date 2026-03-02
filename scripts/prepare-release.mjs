import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { bumpRelease, version2Str } from "@shaman-apprentice/release-parrot";

const execFileAsync = promisify(execFile);

const releaseDate = new Date().toISOString().slice(0, 10);
const { nextVersion } = await bumpRelease({
  releaseHeaderTemplate: `## [{{nextVersion}}] - ${releaseDate} ([full diff](https://github.com/shaman-apprentice/i18n-parrot/compare/v{{previousVersion}}...v{{nextVersion}}))`,
});
const nextTag = `v${version2Str(nextVersion)}`;
console.log(`Bumped version for ${nextTag}`);

await execFileAsync("git", ["commit", "CHANGELOG.md", "package.json", "-m", `chore(release): bump ${nextTag}`]);
await execFileAsync("git", ["push"]);
console.log("Committed and pushed CHANGELOG.md and package.json");

await execFileAsync("git", ["tag", "-a", nextTag, "-m", `chore(release): ${nextTag}`]);
await execFileAsync("git", ["push", "origin", "tag", nextTag]);
console.log(`Created tag ${nextTag} and pushed it`);

console.log(`All set up. You are ready to publish ${nextTag}`);
