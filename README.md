# LifeSync 🔗
> Your entire digital life, unified. Built for the Wire Hackathon 2026.

## What it does
LifeSync pulls real-time data from 8+ platforms via Anakin's Wire API and uses Groq AI to generate a personalized daily briefing — all in one dashboard.

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
| Platform | Data | Auth Required |
|---|---|---|
| ESPNcricinfo | Live cricket scores | No |
| Reddit | Trending posts & subreddits | No |
| Groww | ETF & market data | No |
| Amazon | Product & price data | Yes |
| Flipkart | Price drops & deals | Yes |
| Spotify | Albums & tracks | No |
| Indeed | Job listings | No |
| YouTube | Channel info | No |

## How Wire Powers It
Wire handles browser rendering, login persistence, anti-bot bypass, and proxy routing across 207 countries. We call:
1. `POST /v1/wire/task` — submit an action with action_id and parameters
2. `GET /v1/wire/jobs/{id}` — poll for results
3. Get back clean structured JSON — no scrapers, no selectors, no maintenance

## How to Run
No build step needed — just open in browser:

```bash
# Option 1 — VS Code Live Server (recommended)
# Right click index.html → Open with Live Server

# Option 2 — Python
python3 -m http.server 3000

# Option 3 — Node
npx serve .
```

## Setup
1. Get your Groq API key from console.groq.com
2. Get your Anakin API key from anakin.io
3. Open `src/scripts/dashboard.js` and add your keys:

```js
const GROQ_API_KEY = 'your_groq_key';
const ANAKIN_API_KEY = 'your_anakin_key';
```

## Project Structure
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
│       ├── dashboard.js    ← Dashboard logic + Wire + Groq integration
│       └── wire.js         ← Wire API module
└── README.md
```

## Built With
- [Wire by Anakin](https://anakin.io) — pre-built actions for 130+ websites
- [Groq API](https://groq.com) — llama-3.3-70b-versatile
- Google Fonts — Syne + DM Sans

## Hackathon
Built solo for the **Wire Hackathon 2026** by Anakin.
Submitted by: Aryan Dandotiya

---
*The internet is your database. Wire is the query layer. Groq makes it human.*