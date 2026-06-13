#!/usr/bin/env node
// Pre-deploy QA gate for the Nodal landing page.
// Run:  node qa-check.mjs    (exit 0 = OK, exit 1 = something regressed)
// Verifies the Market DNA content matches the reference terminal data, plus
// other deploy-critical invariants (favicon, OG tags, apex domain, CTA, logo).

import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const dir = dirname(fileURLToPath(import.meta.url));
const html = readFileSync(join(dir, "index.html"), "utf8");

const fails = [];
const must = (label, cond) => { if (!cond) fails.push(label); };
const has = (s) => html.includes(s);

// ---- Market DNA: reference values (must match the terminal screenshots) ----
const dna = [
  // S&P 500 — High-volatility expansion
  "High-volatility expansion", "Up but choppy, narrow leadership",
  "15.4%", "above the 14% historical median → elevated",
  "+12.2%", "strong uptrend (≥ +10%)", "2023-02-07 (Recovery)", "yahoo:%5EGSPC",
  // Gold spot — Risk-off drawdown
  "Risk-off drawdown", "Macro stress, 10%+ down",
  "25.4%", "far above the 15% historical median → stressed",
  "-13.8%", "serious drawdown (≤ -10%)", "2020-11-25 (Correction)", "yahoo:GC%3DF",
  // Bitcoin — Risk-off drawdown
  "39.1%", "well below the 60% historical median for this asset → unusually calm",
  "-13.4%", "2020-01-09 (Risk-off drawdown)", "BTC-USD",
  // EUR / USD — Low-volatility expansion
  "Low-volatility expansion", "Calm uptrend, broad participation",
  "4.0%", "well below the 7% historical median for this asset → unusually calm",
  "+0.1%", "mild uptrend", "2024-03-07 (Low-volatility expansion)", "yahoo:EURUSD%3DX",
  // shared explanation prefixes
  "annualised 20-day realised volatility", "total return over the last 60 trading days",
];
dna.forEach((s) => must(`Market DNA missing: "${s}"`, has(s)));

// ---- regression guards (values/labels that must NOT reappear) ----
must('stale Bitcoin sigma "39.2%" present', !has("39.2%"));
must('"MiFID best-exec" label should be removed', !has("MiFID best-exec"));
must('exec "Slip" column should be removed', !has("<th>Slip</th>"));

// ---- favicon / icons ----
["/favicon.svg", "/favicon-32.png", "/apple-touch-icon.png"].forEach((p) =>
  must(`favicon link missing: ${p}`, has(`href="${p}"`)));
["favicon.svg", "favicon-32.png", "apple-touch-icon.png", "og-image.png"].forEach((f) =>
  must(`asset file missing on disk: ${f}`, existsSync(join(dir, f))));

// ---- Open Graph / domain ----
must("og:image not absolute nodal.trade URL", has('content="https://nodal.trade/og-image.png"'));
must("og:url should be apex (no www)", has('content="https://nodal.trade"'));
must("og:url must not use www", !has("https://www.nodal.trade"));

// ---- brand + CTA ----
must("wordmark not wrapped (Nodal . space bug)", (html.match(/class="wm"/g) || []).length >= 2);
must("two-square logo mark missing", has('rx="2.5" fill="#f5a623"'));
must("CTA button text should be black (#000)", has("background:var(--amber)") && has("color:#000"));

// ---- structure sanity ----
must("closing tags missing", html.trim().endsWith("</html>"));
must("hero terminal preview missing", has('id="dna"') && has('id="exec"') && has('id="wl"'));

if (fails.length) {
  console.error("QA FAILED — " + fails.length + " issue(s):");
  fails.forEach((f) => console.error("  ✗ " + f));
  process.exit(1);
}
console.log("QA PASSED ✓  Market DNA + deploy invariants verified.");
