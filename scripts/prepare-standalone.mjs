import { cp, mkdir, rm } from "node:fs/promises";
import { existsSync } from "node:fs";
import { resolve } from "node:path";

const root = process.cwd();
const standaloneRoot = resolve(root, ".next/standalone");
const standaloneNext = resolve(standaloneRoot, ".next");
const sourceStatic = resolve(root, ".next/static");
const targetStatic = resolve(standaloneNext, "static");
const sourcePublic = resolve(root, "public");
const targetPublic = resolve(standaloneRoot, "public");

if (!existsSync(standaloneRoot)) {
  throw new Error("Next.js standalone output is missing; verify output: 'standalone' is configured.");
}

if (!existsSync(sourceStatic)) {
  throw new Error("Next.js static build output is missing.");
}

await mkdir(standaloneNext, { recursive: true });
await rm(targetStatic, { recursive: true, force: true });
await cp(sourceStatic, targetStatic, { recursive: true });

if (existsSync(sourcePublic)) {
  await rm(targetPublic, { recursive: true, force: true });
  await cp(sourcePublic, targetPublic, { recursive: true });
}

console.log("Prepared Next.js standalone runtime assets.");
