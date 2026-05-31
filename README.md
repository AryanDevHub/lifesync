<<<<<<< HEAD
# LifeSync 🔗

> Your entire digital life, unified. Powered by Wire + Claude AI.

Built for the **Wire Hackathon 2026** — solo project, shipped in a weekend.

---

## What it does

**LifeSync** pulls your real data from LinkedIn, Reddit, Twitter, and Amazon via Wire's pre-built action layer, then uses Claude AI to give you:

- **Daily Digest** — A personalized morning briefing written by Claude, based on live data
- **People Intel** — Research anyone (public profiles or people you follow) before a meeting or collab
- **Network Pulse** — See what your professional circle is talking about right now

---

## The stack

```
Wire API          →  fetches real data from any platform (no scrapers, no selectors)
Claude AI         →  turns raw JSON into useful, human-readable briefings
Vanilla JS + CSS  →  no framework, ships instantly, zero build step
```

---

## Project structure

```
lifesync/
├── index.html              ← Landing page
├── dashboard.html          ← Main app dashboard
├── src/
│   ├── styles/
│   │   ├── main.css        ← Landing page styles + animations
│   │   └── dashboard.css   ← Dashboard UI styles
│   └── scripts/
│       ├── landing.js      ← Landing page scroll animations
│       ├── dashboard.js    ← Dashboard logic, pages, mock data
│       └── wire.js         ← Wire + Claude integration module
└── README.md
```

---

## How to run

No build step needed. Just open in a browser:

```bash
# Option 1 — VS Code Live Server (recommended)
# Install "Live Server" extension → Right click index.html → Open with Live Server

# Option 2 — Python
python3 -m http.server 3000
# Then open http://localhost:3000

# Option 3 — Node
npx serve .
```

---

## Connecting Wire (for real data)

1. Sign up at [useanakin.com](https://useanakin.com) and get your Wire API key
2. In `src/scripts/wire.js`, set your key:

```js
const WIRE_API_KEY = 'your_key_here';
```

3. Pass user credentials when calling Wire actions:

```js
import { getLinkedInDigest, generateDailyDigest } from './src/scripts/wire.js';

// Fetch real LinkedIn data
const linkedInData = await getLinkedInDigest({
  username: 'user@email.com',
  password: 'password',
});

// Generate AI briefing with Claude
const briefing = await generateDailyDigest({ linkedin: linkedInData });
console.log(briefing);
```

---

## Wire actions used

| Platform  | Action                    | Returns                          |
|-----------|---------------------------|----------------------------------|
| LinkedIn  | `get_profile_views`       | Who viewed your profile          |
| LinkedIn  | `get_job_recommendations` | Matched job listings             |
| LinkedIn  | `get_new_connections`     | Recent connection activity       |
| Reddit    | `get_saved_posts`         | Your saved/upvoted posts         |
| Reddit    | `get_recent_karma`        | Comment/post karma changes       |
| Twitter   | `get_activity_summary`    | Mentions, replies, engagement    |
| Amazon    | `get_wishlist_price_drops`| Price alerts on your wishlist    |
| Twitter   | `get_public_profile`      | Anyone's public posts & activity |
| LinkedIn  | `get_public_profile`      | Anyone's public LinkedIn info    |

---

## People Intel — privacy approach

LifeSync only fetches data from:
- **Public profiles** — anyone can view these; Wire simply structures them
- **People you follow** — you've already opted into seeing their content

This is the same data you'd see manually in a browser. Wire just returns it as clean JSON instead.

---

## Claude prompts

See `src/scripts/wire.js` for the full prompts used to generate:
- `generateDailyDigest()` — morning briefing from raw Wire data
- `generatePeopleReport()` — people intel summary with conversation starters

---

## Hackathon notes

- **Solo build** — designed, coded, and shipped in one weekend
- **Zero dependencies** — no npm, no webpack, no framework. Pure HTML/CSS/JS
- **Wire-first** — all data flows through Wire; Claude only sees structured JSON
- **Modular** — `wire.js` is fully reusable for any other Wire-powered app

---

*The internet is your database. Wire is the query layer. Ship something.*
=======
# lifesync
AI-powered personal dashboard that unifies your digital life — cricket, markets, Reddit, jobs &amp; price drops — via Wire API + Groq AI.

# LifeSync 🔗
> Your entire digital life, unified. Built for the Wire Hackathon 2026.

## What it does
LifeSync pulls real-time data from 8+ platforms via Anakin's Wire API 
and uses Groq AI to generate a personalized daily briefing — all in one dashboard.

## Features
- 📡 **Daily Digest** — AI-written morning briefing from live platform data
- 🏏 **Live Cricket** — Real-time scores via ESPNcricinfo + Wire
- 🔍 **People Intel** — AI profile reports on anyone in your network
- 📊 **Network Pulse** — Reddit trends + market insights
- 📈 **Groww Integration** — Live ETF and market data
- 🛒 **Price Alerts** — Amazon & Flipkart price drops
- 💼 **Job Matches** — Indeed listings matched to your profile

## Tech Stack
- **Data Layer** — Wire by Anakin (pre-built actions for 130+ sites)
- **AI Layer** — Groq API (llama-3.3-70b-versatile)
- **Frontend** — Vanilla HTML, CSS, JavaScript (zero dependencies)

## Platforms Connected via Wire
| Platform | Data | Auth |
|---|---|---|
| ESPNcricinfo | Live cricket scores | None |
| Reddit | Trending posts & subreddits | None |
| Groww | ETF & market data | None |
| Amazon | Product & price data | Required |
| Flipkart | Price drops & deals | Required |
| Spotify | Albums & tracks | None |
| Indeed | Job listings | None |
| YouTube | Channel info | None |

## How Wire Powers It
Wire handles browser rendering, login persistence, anti-bot bypass, 
and proxy routing. We call:
1. `POST /v1/wire/task` — submit an action
2. `GET /v1/wire/jobs/{id}` — poll for results
3. Get back clean structured JSON — no scrapers, no selectors

## How to Run
No build step needed — just open in browser:
\```bash
# Option 1 — VS Code Live Server
# Right click index.html → Open with Live Server

# Option 2 — Python
python3 -m http.server 3000

# Option 3 — Node
npx serve .
\```

## Setup
1. Get your Groq API key from console.groq.com
2. Get your Anakin API key from anakin.io
3. Open `src/scripts/dashboard.js` and add your keys:
\```js
const GROQ_API_KEY = 'your_groq_key';
const ANAKIN_API_KEY = 'your_anakin_key';
\```

## Built With
- Wire by Anakin — https://anakin.io
- Groq API — https://groq.com
- Google Fonts (Syne + DM Sans)

## Hackathon
Built solo for the **Wire Hackathon 2026** by Anakin.

>>>>>>> ca5df067042bfe1100bb67160e65c67c1d7881cf
