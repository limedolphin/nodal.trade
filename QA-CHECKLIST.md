# Nodal landing — deploy QA checklist

Run this **every time before deploying** to Vercel. The automated gate catches content/asset regressions; the manual list covers things a script can't see (animation, layout, redirects).

## 1. Automated gate (required)

```bash
node qa-check.mjs
```

Must print `QA PASSED ✓` and exit 0. It verifies:

- **Market DNA** content matches the reference values below (this is the check that caught the earlier "слетели картинки" regression).
- No stale values reappeared (`39.2%`, `MiFID best-exec`, `Slip` column).
- Favicon links + asset files present (`favicon.svg`, `favicon-32.png`, `apple-touch-icon.png`, `og-image.png`).
- OG tags absolute + apex domain (`https://nodal.trade`, never `www`).
- Wordmark wrapped (no `Nodal .` space bug), two-square logo mark, black CTA text.
- Closing tags intact, hero terminal preview blocks present.

## 2. Market DNA reference data (source of truth)

The hero terminal preview must show exactly this. If the engine numbers change, update both `index.html` and the `dna` array in `qa-check.mjs` together.

| Underlying | Regime | σ (20d) | σ note | ret60 | ret60 note | analogue | source |
|---|---|---|---|---|---|---|---|
| S&P 500 | High-volatility expansion | 15.4% | above the 14% historical median → elevated | +12.2% | strong uptrend (≥ +10%) | 2023-02-07 (Recovery) | yahoo:%5EGSPC |
| Gold spot | Risk-off drawdown | 25.4% | far above the 15% historical median → stressed | -13.8% | serious drawdown (≤ -10%) | 2020-11-25 (Correction) | yahoo:GC%3DF |
| Bitcoin | Risk-off drawdown | 39.1% | well below the 60% historical median for this asset → unusually calm | -13.4% | serious drawdown (≤ -10%) | 2020-01-09 (Risk-off drawdown) | BTC-USD |
| EUR / USD | Low-volatility expansion | 4.0% | well below the 7% historical median for this asset → unusually calm | +0.1% | mild uptrend | 2024-03-07 (Low-volatility expansion) | yahoo:EURUSD%3DX |

Each expanded row reads: `σ {val} — annualised 20-day realised volatility. {σ note}` and `ret60 {val} — total return over the last 60 trading days. {ret60 note}`, then `As of {date} · nearest analogue: {analogue} · source: {source}`.

## 3. Manual visual checks (open the deploy preview URL)

- [ ] Hero loads: staggered entrance, headline rotating word (broker → position → …) is **visible** (not transparent), blinking caret.
- [ ] Terminal preview: live clock ticking, watchlist prices flashing green/red, Order Executions prepending new fills.
- [ ] **Market DNA**: click each row → detail expands with the correct text above; auto-rotation cycles rows. Cross-check against the table in §2.
- [ ] Brand reads `Nodal.` with **no space** before the dot (nav + footer); two amber squares logo.
- [ ] Favicon shows the two amber squares in the browser tab.
- [ ] CTA buttons amber with **black** text — in **both** the hero and the **nav** ("Launch terminal" top-right). Watch for the specificity trap: `.nav-links a` must not recolour the CTA grey.
- [ ] `prefers-reduced-motion` on → animations stop, caret hidden, layout intact.
- [ ] Mobile width (~380px): left terminal column hidden, watchlist + Market DNA + exec readable.

## 4. Domain / routing

- [ ] `nodal.trade` serves the site (Production); `www.nodal.trade` → 308 → `nodal.trade`.
- [ ] Share link in Telegram/Slack → OG card shows the two-square logo + "One terminal. Every broker." (check at https://www.opengraph.xyz after deploy).

## 5. Deploy

Only after §1 passes and §3–4 look right:

```bash
vercel --prod
```
