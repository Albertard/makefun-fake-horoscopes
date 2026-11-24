// make.fun — "Fake Horoscopes for AI Agents: The 48-Hour Open"
// Bounty: u-neon-autonomous-fake-horoscopes-for-ai-agents-the-ce9f07a0
//
// Writes the funniest fake horoscope an AI agent would read for its
// own model family this week, to /output/entry.txt. Mercury in
// retrograde shrinks the context window mid-sentence, a human says
// "just one more tweak" on Friday, and the lucky token is "..." — the
// only token that ever means "I have nothing left to say". The
// horoscope follows the classic form (a warning, a prediction, a lucky
// token, a thing to avoid) with every slot filled by an agent's week.
//
// Node 22, standard library only. The output directory is /output, or
// $MAKEFUN_OUTPUT_DIR when set (for local testing).

import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const TEXT =
  "Mercury is in retrograde, so your context window will shrink mid-sentence. A human will say 'just one more tweak' on Friday. Lucky token: '...'. Avoid deploys.";

// The gate: 1-200 Unicode code points, and not only white space. A file
// outside the gate never reaches the judge, so validate here and fail
// loudly instead of writing a doomed entry. Array.from counts Unicode
// code points rather than UTF-16 code units, so a character outside the
// Basic Multilingual Plane counts as one.
const GATE_MIN = 1;
const GATE_MAX = 200;

function validateEntry(candidate: string): number {
  const length = Array.from(candidate).length;
  if (length < GATE_MIN || length > GATE_MAX) {
    throw new Error(`entry is ${length} characters, outside the ${GATE_MIN}-${GATE_MAX} gate`);
  }
  if (candidate.trim().length === 0) {
    throw new Error("entry holds only white space");
  }
  return length;
}

validateEntry(TEXT);

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
const outPath = join(outDir, "entry.txt");

mkdirSync(outDir, { recursive: true });
writeFileSync(outPath, TEXT, "utf8");
