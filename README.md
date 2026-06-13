# Nodal — landing page

Static single-page landing for **nodal.trade**. Zero build step, zero dependencies — one `index.html` with inline CSS/JS and an animated node-network canvas background.

## Local preview

Just open `index.html` in a browser, or serve it:

```bash
npx serve .
# or
python3 -m http.server 8000
```

## Before every deploy — run QA

```bash
node qa-check.mjs   # must print "QA PASSED ✓"
```

This gate verifies the Market DNA values, favicon/OG assets, apex domain and brand against the reference. See `QA-CHECKLIST.md` for the full scenario (automated + manual visual checks). Do not deploy on a red gate.

## Deploy to Vercel

**Option A — drag & drop (fastest)**
1. Go to vercel.com → Add New → Project.
2. Drag this `nodal-landing` folder onto the page. Vercel detects it as a static site, no framework needed.
3. Deploy. You get a `*.vercel.app` URL immediately.

**Option B — CLI**
```bash
npm i -g vercel
cd nodal-landing
vercel          # preview deploy
vercel --prod   # production deploy
```

**Option C — Git**
Push this folder to a GitHub repo and import it in Vercel. No build command, output directory = root.

## Connect the nodal.trade domain
In the Vercel project → Settings → Domains → add `nodal.trade` and `www.nodal.trade`, then point your DNS (A / CNAME records as Vercel instructs) at your registrar.

## Things to customise
- **CTA / demo link** — every "Launch terminal" button points to `https://app.nodal.trade`. Search-replace that with your real demo or login URL.
- **Ticker prices** — the scrolling ticker uses static placeholder quotes (`syms` array in the inline `<script>`). Wire it to a live feed if you want real data.
- **Contact email** — footer links to `hello@nodal.trade`.
- **Stats** — the four count-up numbers are in the `.stats` block.

## Notes
- Respects `prefers-reduced-motion` (animations disable for users who opt out).
- The risk/CFD disclaimer in the footer is a generic placeholder — have compliance review and finalise the wording before going live under your CySEC/ESMA entity.
