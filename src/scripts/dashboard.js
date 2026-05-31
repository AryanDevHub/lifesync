// CONFIG — paste your keys here locally only
// =====================
const GROQ_API_KEY = 'YOUR_GROQ_KEY_HERE';
const ANAKIN_API_KEY = 'YOUR_ANAKIN_KEY_HERE';

const GROQ_HEADERS = {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${GROQ_API_KEY}`,
};

const ANAKIN_HEADERS = {
  'Content-Type': 'application/json',
  'X-API-Key': ANAKIN_API_KEY,
};

const ANAKIN_BASE = 'https://api.anakin.io/v1';

// =====================
// WIRE ACTION IDs (confirmed from catalog)
// =====================
const WIRE_ACTIONS = {
  cricket_live:    'act_espncricinfo_live_matches_listing',
  reddit_popular:  'rt_popular_subreddits',
  reddit_posts:    'rt_subreddit_posts',
  spotify_album:   'sp_album',
  indeed_job:      'in_job_details',
  youtube_channel: 'yt_channel',
  groww_etf:       'gw_etf_details',
  amazon_search:   'am_search_products',
  flipkart_search: 'fk_search_products',
};

// =====================
// WIRE HELPERS
// =====================
async function wireSubmitTask(action_id, parameters = {}, credential_id = null) {
  const body = { action_id, parameters };
  if (credential_id) body.credential_id = credential_id;
  const res = await fetch(`${ANAKIN_BASE}/wire/task`, {
    method: 'POST',
    headers: ANAKIN_HEADERS,
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.message || data?.code || 'Wire task failed');
  return data.job_id;
}

async function wirePollJob(job_id, maxWait = 30000) {
  const start = Date.now();
  while (Date.now() - start < maxWait) {
    const res = await fetch(`${ANAKIN_BASE}/wire/jobs/${job_id}`, {
      headers: ANAKIN_HEADERS,
    });
    const data = await res.json();
    if (data.status === 'completed') return data.result;
    if (data.status === 'failed') throw new Error('Wire job failed');
    await new Promise(r => setTimeout(r, 2500));
  }
  throw new Error('Wire job timed out');
}

async function wireFetch(action_id, parameters = {}, credential_id = null) {
  const job_id = await wireSubmitTask(action_id, parameters, credential_id);
  return wirePollJob(job_id);
}

// =====================
// MOCK DATA
// =====================
const mockActivity = [
  { icon: '🏏', bg: 'rgba(16,185,129,0.1)', platform: 'ESPNcricinfo', text: '<strong>India vs Australia</strong> — Live: IND 287/4', time: 'Live' },
  { icon: '🟠', bg: 'rgba(255,100,50,0.1)', platform: 'Reddit', text: 'Trending in r/india: <strong>"Budget 2026 Highlights"</strong>', time: '1 hr ago' },
  { icon: '📈', bg: 'rgba(16,185,129,0.1)', platform: 'Groww', text: '<strong>Nifty 50</strong> up 1.2% today — Portfolio +₹3,240', time: '2 hr ago' },
  { icon: '📦', bg: 'rgba(245,158,11,0.1)', platform: 'Amazon', text: '<strong>Sony WH-1000XM5</strong> dropped 18% — now ₹24,990', time: '3 hr ago' },
  { icon: '🛒', bg: 'rgba(248,113,113,0.1)', platform: 'Flipkart', text: '<strong>iPhone 15</strong> price drop — ₹2,000 off today', time: '4 hr ago' },
  { icon: '🎵', bg: 'rgba(108,99,255,0.1)', platform: 'Spotify', text: 'New album by <strong>Arijit Singh</strong> — 12 tracks', time: '5 hr ago' },
  { icon: '💼', bg: 'rgba(79,172,254,0.1)', platform: 'Indeed', text: 'New match: <strong>Senior Frontend Engineer</strong> at Razorpay', time: '6 hr ago' },
];

const mockPlatforms = [
  { icon: '🏏', name: 'ESPNcricinfo', status: 'connected', updates: 'Live scores', slug: 'espncricinfo', auth: false },
  { icon: '🟠', name: 'Reddit', status: 'connected', updates: 'Trending posts', slug: 'reddit', auth: false },
  { icon: '📈', name: 'Groww', status: 'connected', updates: 'ETF & stocks', slug: 'groww', auth: false },
  { icon: '📦', name: 'Amazon', status: 'offline', updates: 'Needs login', slug: 'amazon', auth: true },
  { icon: '🛒', name: 'Flipkart', status: 'offline', updates: 'Needs login', slug: 'flipkart', auth: true },
  { icon: '🎵', name: 'Spotify', status: 'connected', updates: 'Albums & tracks', slug: 'spotify', auth: false },
  { icon: '💼', name: 'Indeed', status: 'connected', updates: 'Job listings', slug: 'indeed', auth: false },
  { icon: '📺', name: 'YouTube', status: 'connected', updates: 'Channel info', slug: 'youtube', auth: false },
];

const mockPeople = [
  { name: 'Alex Dev', handle: '@alexdev', initials: 'AD', avatarBg: 'linear-gradient(135deg,#6c63ff,#4facfe)', badge: 'following', summary: 'Prolific open-source contributor. Writes daily about developer tools, AI infra, and Rust.', tags: ['DevTools', 'Rust', 'AI'] },
  { name: 'Sarah Chen', handle: 'sarahchen.design', initials: 'SC', avatarBg: 'linear-gradient(135deg,#f59e0b,#f87171)', badge: 'public', summary: 'Product designer at Figma. Posts about design systems and accessibility.', tags: ['Design', 'Figma', 'Product'] },
  { name: 'Rahul Mehta', handle: '@rahulmehta_vc', initials: 'RM', avatarBg: 'linear-gradient(135deg,#10b981,#4facfe)', badge: 'public', summary: 'Early-stage VC at Blume Ventures. Tweets about SaaS metrics.', tags: ['VC', 'SaaS', 'B2B'] },
];

const panelData = {
  recent: [
    { name: 'IND vs AUS', handle: 'ESPNcricinfo', summary: 'India 287/4 in 45 overs', time: 'Live', initials: '🏏', color: '#10b981' },
    { name: 'r/india trending', handle: 'Reddit', summary: 'Budget 2026 discussion', time: '1h ago', initials: '🟠', color: '#f87171' },
    { name: 'Nifty 50', handle: 'Groww', summary: '+1.2% today', time: '2h ago', initials: '📈', color: '#10b981' },
  ],
  saved: [
    { name: 'Sony WH-1000XM5', handle: 'Amazon', summary: 'Price drop alert — ₹24,990', time: 'Now', initials: '📦', color: '#f59e0b' },
    { name: 'Frontend Engineer', handle: 'Indeed', summary: 'Razorpay — 90% match', time: '6h ago', initials: '💼', color: '#6c63ff' },
  ],
  alerts: [
    { name: 'Price Drop!', handle: 'Flipkart', summary: 'iPhone 15 — ₹2,000 off', time: 'Now', initials: '🛒', color: '#f87171' },
    { name: 'New Album', handle: 'Spotify', summary: 'Arijit Singh dropped new tracks', time: '5h ago', initials: '🎵', color: '#6c63ff' },
  ],
};

let liveActivity = [];
let liveMatches = [];
let identities = {};
let currentPage = 'digest';
let aiGeneratedText = '';

// =====================
// GROQ AI
// =====================
async function askGroq(prompt, maxTokens = 600) {
  const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: GROQ_HEADERS,
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      max_tokens: maxTokens,
      messages: [{ role: 'user', content: prompt }],
    }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.error?.message || 'Groq error');
  return data.choices[0].message.content;
}

// =====================
// NAVIGATION
// =====================
const pages = {
  digest: renderDigest,
  cricket: renderCricket,
  intel: renderIntel,
  pulse: renderPulse,
  accounts: renderAccounts,
  alerts: renderAlertsPage,
  settings: renderSettings,
};

function setPage(page) {
  currentPage = page;
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  document.querySelector(`[data-page="${page}"]`)?.classList.add('active');

  const titles = {
    digest: ['Daily Digest', 'Powered by Wire + Groq AI'],
    cricket: ['🏏 Live Cricket', 'ESPNcricinfo via Wire'],
    intel: ['People Intel', 'Research anyone in your network'],
    pulse: ['Network Pulse', 'Reddit trends + market data'],
    accounts: ['Connected Accounts', 'Manage your Wire connections'],
    alerts: ['Alerts', 'Price drops, job matches & more'],
    settings: ['Preferences', 'Customize your experience'],
  };

  const [title, sub] = titles[page] || ['LifeSync', ''];
  document.getElementById('page-title').textContent = title;
  document.getElementById('page-sub').textContent = sub;

  const content = document.getElementById('main-content');
  content.style.opacity = '0';
  content.style.transform = 'translateY(10px)';
  setTimeout(() => {
    pages[page]?.();
    content.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
    content.style.opacity = '1';
    content.style.transform = 'translateY(0)';
  }, 150);
}

// =====================
// DIGEST PAGE
// =====================
function renderDigest() {
  const activity = liveActivity.length ? liveActivity : mockActivity;
  const content = document.getElementById('main-content');
  content.innerHTML = `
    <div class="stats-row">
      ${[
        { icon: '🏏', value: liveMatches.length || '3', label: 'Live cricket matches', change: 'LIVE', up: true },
        { icon: '📬', value: activity.length, label: 'Updates today', change: '', up: true },
        { icon: '💰', value: '3', label: 'Price drops', change: 'Amazon+FK', up: false },
        { icon: '💼', value: '5', label: 'Job matches', change: 'Indeed', up: false },
      ].map(s => `
        <div class="stat-card">
          <div class="stat-icon">${s.icon}</div>
          <div class="stat-value">${s.value}</div>
          <div class="stat-label">${s.label}</div>
          ${s.change ? `<div class="stat-change ${s.up ? 'up' : 'neutral'}">${s.change}</div>` : ''}
        </div>
      `).join('')}
    </div>

    <!-- Live Cricket Banner -->
    <div class="card" style="background:linear-gradient(135deg,rgba(16,185,129,0.1),rgba(79,172,254,0.05));border-color:rgba(16,185,129,0.3);cursor:pointer;" onclick="setPage('cricket')">
      <div class="card-header">
        <div class="card-title">🏏 Live Cricket <span style="font-size:0.7rem;color:var(--green);margin-left:8px;animation:blink 1s infinite;">● LIVE</span></div>
        <span class="card-action">View all →</span>
      </div>
      <div id="cricket-preview">
        ${liveMatches.length ? liveMatches.slice(0,2).map(m => `
          <div style="padding:8px 0;border-bottom:1px solid var(--border);font-size:0.875rem;">
            <strong>${m.teams || m.title || 'Match'}</strong>
            <span style="color:var(--text2);margin-left:8px;">${m.status || m.score || 'Live'}</span>
          </div>
        `).join('') : `
          <div style="font-size:0.875rem;color:var(--text2);">
            <button class="btn-sm primary" onclick="event.stopPropagation();fetchCricket()" style="margin-right:8px;">⟳ Fetch Live Scores</button>
            Click to load live cricket via Wire
          </div>
        `}
      </div>
    </div>

    <div class="digest-grid">
      <div class="digest-card">
        <div class="card-header">
          <div class="card-title">✦ AI Morning Briefing</div>
          <span class="card-action" onclick="generateDigest()">Regenerate</span>
        </div>
        <div id="ai-digest-area">
          ${aiGeneratedText
            ? `<div class="ai-response">${aiGeneratedText}</div>`
            : renderAIEmpty()}
        </div>
      </div>

      <div class="digest-card">
        <div class="card-header">
          <div class="card-title">Connected Platforms</div>
          <span class="card-action" onclick="setPage('accounts')">Manage</span>
        </div>
        <div class="platform-list">
          ${mockPlatforms.map(p => `
            <div class="platform-item">
              <div class="platform-logo">${p.icon}</div>
              <div class="platform-info">
                <div class="platform-name">${p.name}</div>
                <div class="platform-status">${identities[p.slug] ? 'Live via Wire ✓' : p.updates}</div>
              </div>
              <div class="status-dot ${identities[p.slug] ? 'connected' : p.status}"></div>
            </div>
          `).join('')}
        </div>
      </div>
    </div>

    <div class="card">
      <div class="card-header">
        <div class="card-title">Activity Feed ${liveActivity.length ? '<span style="font-size:0.7rem;color:var(--green);margin-left:8px;">● LIVE</span>' : ''}</div>
        <span class="card-action" onclick="fetchAllLiveData()">⟳ Fetch Live</span>
      </div>
      <div class="activity-list" id="activity-list">
        ${activity.map(a => `
          <div class="activity-item">
            <div class="activity-icon" style="background:${a.bg}">${a.icon}</div>
            <div class="activity-body">
              <div class="activity-text">${a.text}</div>
              <div class="activity-time">${a.time}</div>
            </div>
            <div class="activity-source">${a.platform}</div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

function renderAIEmpty() {
  return `
    <div class="ai-response" style="text-align:center; padding:32px 16px;">
      <div style="font-size:2rem; margin-bottom:12px;">✦</div>
      <div style="font-size:0.875rem; color:var(--text2); margin-bottom:16px;">
        Generate your AI briefing from live Wire data — cricket, markets, Reddit & more.
      </div>
      <button class="btn-sm primary" onclick="generateDigest()" style="margin:0 auto; display:flex;">
        ✦ Generate Now
      </button>
    </div>`;
}

// =====================
// CRICKET PAGE
// =====================
function renderCricket() {
  const content = document.getElementById('main-content');
  content.innerHTML = `
    <div class="card" style="background:linear-gradient(135deg,rgba(16,185,129,0.08),transparent);border-color:rgba(16,185,129,0.2);">
      <div class="card-header">
        <div class="card-title">🏏 Live & Recent Matches</div>
        <button class="btn-sm primary" onclick="fetchCricket()">⟳ Refresh Scores</button>
      </div>
      <div id="cricket-matches">
        ${liveMatches.length ? renderMatchCards() : `
          <div style="text-align:center; padding:40px; color:var(--text2);">
            <div style="font-size:3rem; margin-bottom:16px;">🏏</div>
            <div style="margin-bottom:20px;">Click Refresh to load live cricket scores via Wire + ESPNcricinfo</div>
            <button class="btn-sm primary" onclick="fetchCricket()">⟳ Load Live Scores</button>
          </div>
        `}
      </div>
    </div>

    <div class="card">
      <div class="card-header">
        <div class="card-title">✦ AI Match Analysis</div>
        <span class="card-action" onclick="generateCricketAnalysis()">Generate</span>
      </div>
      <div id="cricket-ai">
        <div class="ai-response" style="text-align:center; padding:24px; color:var(--text2);">
          Load live scores first, then generate AI match analysis.
        </div>
      </div>
    </div>
  `;
}

function renderMatchCards() {
  return liveMatches.map(m => `
    <div style="padding:16px; border-bottom:1px solid var(--border);">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
        <span style="font-size:0.875rem; font-weight:600; color:var(--text);">${m.teams || m.title || m.match_title || 'Match'}</span>
        <span style="font-size:0.7rem; padding:3px 8px; border-radius:100px; background:rgba(16,185,129,0.15); color:var(--green);">● ${m.status || 'Live'}</span>
      </div>
      <div style="font-size:0.825rem; color:var(--text2);">${m.score || m.description || m.series || ''}</div>
      ${m.venue ? `<div style="font-size:0.75rem; color:var(--text3); margin-top:4px;">📍 ${m.venue}</div>` : ''}
    </div>
  `).join('');
}

async function fetchCricket() {
  const area = document.getElementById('cricket-matches') || document.getElementById('cricket-preview');
  if (area) area.innerHTML = `
    <div style="text-align:center; padding:32px; color:var(--text2);">
      <div class="ai-loading" style="justify-content:center; display:flex; align-items:center; gap:8px;">
        <div class="ai-dots"><span></span><span></span><span></span></div>
        <span>Wire is fetching live scores from ESPNcricinfo...</span>
      </div>
    </div>`;

  try {
    const data = await wireFetch(WIRE_ACTIONS.cricket_live, { lang: 'en' });
    const matches = Array.isArray(data) ? data : data?.matches || data?.data || [];
    liveMatches = matches.slice(0, 10);

    if (currentPage === 'cricket') {
      document.getElementById('cricket-matches').innerHTML =
        liveMatches.length ? renderMatchCards() : '<div style="padding:20px;color:var(--text2);">No live matches right now.</div>';
    } else {
      renderDigest();
    }
  } catch (e) {
    if (area) area.innerHTML = `<div style="color:var(--coral);padding:16px;">⚠️ ${e.message}</div>`;
  }
}

async function generateCricketAnalysis() {
  const area = document.getElementById('cricket-ai');
  if (!area) return;
  if (!liveMatches.length) {
    area.innerHTML = `<div class="ai-response" style="color:var(--amber);">⚠️ Load live scores first!</div>`;
    return;
  }
  area.innerHTML = `<div class="ai-response" style="text-align:center;padding:20px;"><div class="ai-loading" style="display:flex;justify-content:center;align-items:center;gap:8px;"><div class="ai-dots"><span></span><span></span><span></span></div><span>Groq AI is analysing matches...</span></div></div>`;

  try {
    const text = await askGroq(`You are a cricket analyst. Based on these live match details, give a brief exciting commentary and prediction. Use **bold** for team names and scores.\n\nMatches: ${JSON.stringify(liveMatches.slice(0,3))}\n\nWrite analysis:`, 300);
    const formatted = text.replace(/\*\*(.*?)\*\*/g, '<strong style="color:var(--text)">$1</strong>').replace(/\n/g, '<br>');
    area.innerHTML = `<div class="ai-response" style="font-size:0.875rem;">${formatted}</div>`;
  } catch (e) {
    area.innerHTML = `<div class="ai-response" style="color:var(--coral);">⚠️ ${e.message}</div>`;
  }
}

// =====================
// FETCH ALL LIVE DATA
// =====================
async function fetchAllLiveData() {
  const list = document.getElementById('activity-list');
  if (list) list.innerHTML = `
    <div style="text-align:center; padding:24px; color:var(--text2);">
      <div class="ai-loading" style="justify-content:center; display:flex; align-items:center; gap:8px;">
        <div class="ai-dots"><span></span><span></span><span></span></div>
        <span>Wire is fetching live data from all platforms...</span>
      </div>
    </div>`;

  const results = [];

  // Cricket scores
  try {
    const data = await wireFetch(WIRE_ACTIONS.cricket_live, { lang: 'en' });
    const matches = Array.isArray(data) ? data : data?.matches || [];
    liveMatches = matches.slice(0, 5);
    matches.slice(0, 2).forEach(m => results.push({
      icon: '🏏', bg: 'rgba(16,185,129,0.1)', platform: 'ESPNcricinfo',
      text: `<strong>${m.teams || m.title || 'Cricket Match'}</strong> — ${m.status || m.score || 'Live'}`,
      time: 'Live now',
    }));
  } catch (e) { console.warn('Cricket fetch failed:', e.message); }

  // Reddit trending
  try {
    const data = await wireFetch(WIRE_ACTIONS.reddit_popular, { limit: 5 });
    const subs = Array.isArray(data) ? data : data?.subreddits || [];
    subs.slice(0, 2).forEach(s => results.push({
      icon: '🟠', bg: 'rgba(255,100,50,0.1)', platform: 'Reddit',
      text: `Trending: <strong>r/${s.name || s.display_name || 'popular'}</strong> — ${s.subscribers ? s.subscribers.toLocaleString() + ' members' : ''}`,
      time: 'Now',
    }));
  } catch (e) { console.warn('Reddit fetch failed:', e.message); }

  // Groww ETF
  try {
    const data = await wireFetch(WIRE_ACTIONS.groww_etf, { slug: 'nippon-india-etf-nifty-50' });
    if (data) results.push({
      icon: '📈', bg: 'rgba(16,185,129,0.1)', platform: 'Groww',
      text: `<strong>${data.name || 'Nifty 50 ETF'}</strong> — NAV: ₹${data.nav || data.price || 'N/A'}`,
      time: 'Live',
    });
  } catch (e) { console.warn('Groww fetch failed:', e.message); }

  if (results.length > 0) liveActivity = results;
  renderDigest();
}

// =====================
// AI DIGEST
// =====================
async function generateDigest() {
  if (currentPage !== 'digest') { setPage('digest'); return; }
  const area = document.getElementById('ai-digest-area');
  if (!area) return;

  area.innerHTML = `
    <div class="ai-response" style="text-align:center; padding:24px 16px">
      <div class="ai-loading" style="display:flex; justify-content:center; align-items:center; gap:8px;">
        <div class="ai-dots"><span></span><span></span><span></span></div>
        <span>Groq AI is writing your briefing...</span>
      </div>
    </div>`;

  const activity = liveActivity.length ? liveActivity : mockActivity;
  const activityText = activity.map(a =>
    `[${a.platform}] ${a.text.replace(/<[^>]+>/g, '')} (${a.time})`
  ).join('\n');

  const cricketText = liveMatches.length
    ? '\nLive Cricket: ' + liveMatches.slice(0,2).map(m => `${m.teams || m.title} - ${m.status || 'Live'}`).join(', ')
    : '';

  try {
    const text = await askGroq(`You are LifeSync's AI assistant for an Indian user. Write a concise, friendly morning briefing. Include cricket scores if available. Use **bold** for important names/numbers. Write in 3 short paragraphs. Be specific and energetic.\n\nActivity:\n${activityText}${cricketText}\n\nWrite the briefing:`);
    aiGeneratedText = text
      .replace(/\n\n/g, '<br><br>')
      .replace(/\n/g, '<br>')
      .replace(/\*\*(.*?)\*\*/g, '<strong style="color:var(--text)">$1</strong>');
    area.innerHTML = `
      <div class="ai-response">
        ${aiGeneratedText}
        <br><br>
        <em style="color:var(--text3); font-size:0.75rem;">
          ${liveActivity.length ? '● Live data via Wire' : '● Demo data'} · Groq AI · ${new Date().toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'})}
        </em>
      </div>`;
  } catch (e) {
    area.innerHTML = `<div class="ai-response" style="color:var(--coral)">⚠️ ${e.message}</div>`;
  }
}

// =====================
// PEOPLE INTEL
// =====================
function renderIntel() {
  const content = document.getElementById('main-content');
  content.innerHTML = `
    <div class="card">
      <div class="card-header"><div class="card-title">🔍 Research Anyone</div></div>
      <div class="intel-search">
        <input type="text" class="intel-input" placeholder="Enter name, @handle, or topic..." id="intel-search-input"
          onkeydown="if(event.key==='Enter') searchPerson()" />
        <button class="btn-sm primary" onclick="searchPerson()">✦ Analyse</button>
      </div>
      <div style="font-size:0.75rem; color:var(--text3); margin-top:-4px;">
        ℹ️ Only public profiles — no privacy issues.
      </div>
    </div>
    <div class="card">
      <div class="card-header"><div class="card-title">Your Network</div></div>
      <div class="intel-results" id="intel-results">
        ${mockPeople.map(p => renderPersonCard(p)).join('')}
      </div>
    </div>`;
}

async function searchPerson() {
  const query = document.getElementById('intel-search-input')?.value?.trim();
  if (!query) return;
  const resultsCard = document.getElementById('intel-results');

  resultsCard.innerHTML = `
    <div style="text-align:center; padding:24px;">
      <div class="ai-loading" style="justify-content:center; display:flex; align-items:center; gap:8px;">
        <div class="ai-dots"><span></span><span></span><span></span></div>
        <span>Groq AI is generating intel report...</span>
      </div>
    </div>`;

  try {
    const text = await askGroq(`Write a professional intel brief for "${query}". Include: **Professional Identity** (2 sentences), **Current Focus** (1-2 sentences), **Communication Style** (1 sentence), **Conversation Starters** (2 genuine openers). Keep it useful and professional.`, 350);
    const formatted = text
      .replace(/\n\n/g, '<br><br>').replace(/\n/g, '<br>')
      .replace(/\*\*(.*?)\*\*/g, '<strong style="color:var(--text)">$1</strong>');

    resultsCard.innerHTML = `
      <div class="person-card" style="flex-direction:column; align-items:flex-start; gap:12px;">
        <div style="display:flex; align-items:center; gap:12px; width:100%;">
          <div class="person-avatar" style="background:linear-gradient(135deg,#6c63ff,#00f2fe)">${query.slice(0,2).toUpperCase()}</div>
          <div>
            <div class="person-name">${query}</div>
            <div class="person-handle">● AI-generated intel · Groq</div>
          </div>
          <div class="intel-badge badge-public" style="margin-left:auto">Public</div>
        </div>
        <div class="ai-response" style="width:100%; font-size:0.825rem; line-height:1.75;">${formatted}</div>
      </div>`;
  } catch (e) {
    resultsCard.innerHTML = `<div style="color:var(--coral); padding:16px;">⚠️ ${e.message}</div>`;
  }
}

function renderPersonCard(p) {
  return `
    <div class="person-card" onclick="document.getElementById('intel-search-input').value='${p.name}'; searchPerson();" style="cursor:pointer;">
      <div class="person-avatar" style="background:${p.avatarBg}">${p.initials}</div>
      <div class="person-details">
        <div class="person-name">${p.name}</div>
        <div class="person-handle">${p.handle}</div>
        <div class="person-summary">${p.summary}</div>
        <div class="person-tags">${p.tags.map(t => `<span class="person-tag">${t}</span>`).join('')}</div>
      </div>
      <div class="intel-badge badge-${p.badge}">${p.badge}</div>
    </div>`;
}

// =====================
// NETWORK PULSE
// =====================
function renderPulse() {
  const content = document.getElementById('main-content');
  const topics = [
    { topic: 'AI Infrastructure', count: 14, pct: 88, color: '#6c63ff' },
    { topic: 'Indian Markets', count: 11, pct: 75, color: '#10b981' },
    { topic: 'Cricket WC 2026', count: 9, pct: 65, color: '#f59e0b' },
    { topic: 'Startup Funding', count: 7, pct: 52, color: '#4facfe' },
    { topic: 'Developer Tools', count: 5, pct: 38, color: '#f87171' },
  ];

  content.innerHTML = `
    <div class="stats-row" style="grid-template-columns:repeat(3,1fr)">
      <div class="stat-card"><div class="stat-icon">👥</div><div class="stat-value">23</div><div class="stat-label">Active today</div></div>
      <div class="stat-card"><div class="stat-icon">📝</div><div class="stat-value">41</div><div class="stat-label">Total posts</div></div>
      <div class="stat-card"><div class="stat-icon">🔥</div><div class="stat-value">5</div><div class="stat-label">Trending topics</div></div>
    </div>

    <div class="card">
      <div class="card-header">
        <div class="card-title">📊 Trending Topics</div>
        <span class="card-action" onclick="fetchRedditTrending()">⟳ Live Reddit</span>
      </div>
      <div style="display:flex; flex-direction:column; gap:14px;" id="topics-list">
        ${topics.map(t => `
          <div>
            <div style="display:flex; justify-content:space-between; margin-bottom:6px; font-size:0.875rem;">
              <span style="color:var(--text)">${t.topic}</span>
              <span style="color:var(--text2)">${t.count} posts</span>
            </div>
            <div style="height:6px; background:var(--surface2); border-radius:100px; overflow:hidden;">
              <div style="height:100%; width:0; background:${t.color}; border-radius:100px; transition:width 1s ease;" data-pct="${t.pct}"></div>
            </div>
          </div>
        `).join('')}
      </div>
      <div id="pulse-insight" style="margin-top:16px;">
        <button class="btn-sm primary" onclick="generatePulseInsight()" style="margin-top:4px;">✦ AI Insight</button>
      </div>
    </div>

    <div class="card">
      <div class="card-header"><div class="card-title">🟠 Live Reddit Feed</div></div>
      <div id="reddit-feed" style="display:flex;flex-direction:column;gap:10px;">
        <button class="btn-sm primary" onclick="fetchRedditTrending()">⟳ Load Reddit via Wire</button>
      </div>
    </div>
  `;

  setTimeout(() => {
    document.querySelectorAll('[data-pct]').forEach(b => {
      b.style.width = b.dataset.pct + '%';
    });
  }, 100);
}

async function fetchRedditTrending() {
  const feed = document.getElementById('reddit-feed');
  if (feed) feed.innerHTML = `<div class="ai-loading" style="display:flex;align-items:center;gap:8px;padding:12px;"><div class="ai-dots"><span></span><span></span><span></span></div><span>Wire fetching Reddit...</span></div>`;

  try {
    const data = await wireFetch(WIRE_ACTIONS.reddit_popular, { limit: 8 });
    const subs = Array.isArray(data) ? data : data?.subreddits || data?.data || [];

    if (feed) feed.innerHTML = subs.length ? subs.map(s => `
      <div class="activity-item">
        <div class="activity-icon" style="background:rgba(255,100,50,0.1);">🟠</div>
        <div class="activity-body">
          <div class="activity-text"><strong>r/${s.name || s.display_name || 'subreddit'}</strong></div>
          <div class="activity-time">${s.subscribers ? s.subscribers.toLocaleString() + ' members' : s.title || ''}</div>
        </div>
        <div class="activity-source">Reddit</div>
      </div>
    `).join('') : '<div style="color:var(--text2);padding:12px;">No data returned</div>';
  } catch (e) {
    if (feed) feed.innerHTML = `<div style="color:var(--coral);padding:12px;">⚠️ ${e.message}</div>`;
  }
}

async function generatePulseInsight() {
  const area = document.getElementById('pulse-insight');
  if (!area) return;
  area.innerHTML = `<div class="ai-loading" style="display:flex;align-items:center;gap:8px;font-size:0.8rem;color:var(--text2);"><div class="ai-dots"><span></span><span></span><span></span></div>Generating...</div>`;
  try {
    const text = await askGroq(`Trending topics: AI Infrastructure (14), Indian Markets (11), Cricket WC 2026 (9), Startup Funding (7), Developer Tools (5). Write 2-sentence insight + one recommendation for an Indian professional. Use **bold** for key terms.`, 200);
    const formatted = text.replace(/\*\*(.*?)\*\*/g, '<strong style="color:var(--text)">$1</strong>');
    area.innerHTML = `<div class="ai-response" style="font-size:0.825rem;">${formatted}</div>`;
  } catch (e) {
    area.innerHTML = `<span style="color:var(--coral);font-size:0.8rem;">⚠️ ${e.message}</span>`;
  }
}

// =====================
// ACCOUNTS PAGE
// =====================
function renderAccounts() {
  const content = document.getElementById('main-content');
  content.innerHTML = `
    <div class="card" style="background:rgba(108,99,255,0.05);border-color:rgba(108,99,255,0.2);">
      <div style="font-size:0.875rem;color:var(--text2);line-height:1.7;">
        ⚡ <strong style="color:var(--text)">Powered by Wire</strong> — Platforms marked <span style="color:var(--green)">✓ No auth</span> work instantly. Platforms marked <span style="color:var(--amber)">🔒 Auth</span> need your login credentials.
      </div>
    </div>
    <div class="card">
      <div class="card-header"><div class="card-title">🔗 Platform Connections</div></div>
      <div class="platform-list">
        ${mockPlatforms.map(p => `
          <div class="platform-item">
            <div class="platform-logo">${p.icon}</div>
            <div class="platform-info">
              <div class="platform-name">${p.name}</div>
              <div class="platform-status">${p.auth ? '🔒 Requires login' : '✓ No auth needed'}</div>
            </div>
            <div class="status-dot ${p.auth ? 'offline' : 'connected'}" style="margin-right:8px;"></div>
            ${p.auth ? `<button class="btn-sm primary" onclick="connectPlatform('${p.slug}','${p.name}')">Connect</button>`
                     : `<span style="font-size:0.75rem;color:var(--green);font-weight:600;">Ready ✓</span>`}
          </div>
        `).join('')}
      </div>
    </div>
    <div class="card" id="connect-form" style="display:none;">
      <div class="card-header"><div class="card-title" id="connect-title">Connect Platform</div></div>
      <div id="connect-body"></div>
    </div>
  `;
}

function connectPlatform(slug, name) {
  const form = document.getElementById('connect-form');
  const title = document.getElementById('connect-title');
  const body = document.getElementById('connect-body');
  if (!form || !body) return;
  form.style.display = 'block';
  title.textContent = `Connect ${name}`;
  body.innerHTML = `
    <div style="margin-bottom:12px;font-size:0.825rem;color:var(--text2);">Wire encrypts your credentials and handles login securely.</div>
    <input type="text" class="intel-input" id="wire-user" placeholder="Email or username" style="margin-bottom:10px;width:100%;" />
    <input type="password" class="intel-input" id="wire-pass" placeholder="Password" style="margin-bottom:14px;width:100%;" />
    <button class="btn-sm primary" onclick="submitWireLogin('${slug}','${name}')">🔐 Connect via Wire</button>
    <button class="btn-sm" onclick="document.getElementById('connect-form').style.display='none'" style="margin-left:8px;">Cancel</button>
    <div id="login-status" style="margin-top:12px;font-size:0.8rem;"></div>
  `;
  form.scrollIntoView({ behavior: 'smooth' });
}

async function submitWireLogin(slug, name) {
  const username = document.getElementById('wire-user')?.value;
  const password = document.getElementById('wire-pass')?.value;
  const status = document.getElementById('login-status');
  if (!username || !password) { status.textContent = '⚠️ Please enter both fields.'; return; }
  status.innerHTML = `<div class="ai-loading" style="display:flex;align-items:center;gap:8px;"><div class="ai-dots"><span></span><span></span><span></span></div>Wire is logging in...</div>`;
  try {
    const res = await fetch(`${ANAKIN_BASE}/wire/login`, {
      method: 'POST',
      headers: ANAKIN_HEADERS,
      body: JSON.stringify({ catalog_slug: slug, username, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data?.message || data?.error?.message || JSON.stringify(data));
    identities[slug] = data.credential_id;
    status.innerHTML = `<span style="color:var(--green)">✓ ${name} connected!</span>`;
    setTimeout(() => { document.getElementById('connect-form').style.display = 'none'; renderAccounts(); }, 1500);
  } catch (e) {
    status.innerHTML = `<span style="color:var(--coral)">⚠️ ${e.message}</span>`;
  }
}

// =====================
// ALERTS PAGE
// =====================
function renderAlertsPage() {
  const content = document.getElementById('main-content');
  const alerts = [
    { icon: '🏏', bg: 'rgba(16,185,129,0.1)', title: 'Cricket Live!', text: 'India vs Australia — IND 287/4 in 45 overs', time: 'Live', read: false },
    { icon: '🏷️', bg: 'rgba(245,158,11,0.1)', title: 'Price Drop', text: 'Sony WH-1000XM5 dropped 18% on Amazon — ₹24,990', time: 'Just now', read: false },
    { icon: '🛒', bg: 'rgba(248,113,113,0.1)', title: 'Flipkart Deal', text: 'iPhone 15 — ₹2,000 off today only', time: '1 hr ago', read: false },
    { icon: '💼', bg: 'rgba(108,99,255,0.1)', title: 'Job Match', text: 'Senior Frontend Engineer at Razorpay — 90% match', time: '3 hr ago', read: true },
    { icon: '📈', bg: 'rgba(16,185,129,0.1)', title: 'Market Alert', text: 'Nifty 50 up 1.2% — your Groww portfolio +₹3,240', time: '4 hr ago', read: true },
  ];
  content.innerHTML = `
    <div class="card">
      <div class="card-header"><div class="card-title">🔔 Notifications</div><span class="card-action">Mark all read</span></div>
      <div class="activity-list">
        ${alerts.map(a => `
          <div class="activity-item" style="${a.read ? 'opacity:0.55' : ''}">
            <div class="activity-icon" style="background:${a.bg}">${a.icon}</div>
            <div class="activity-body">
              <div class="activity-text"><strong>${a.title}</strong></div>
              <div class="activity-text" style="font-weight:300;margin-top:2px;">${a.text}</div>
              <div class="activity-time">${a.time}${!a.read ? ' · <span style="color:var(--accent)">Unread</span>' : ''}</div>
            </div>
          </div>
        `).join('')}
      </div>
    </div>`;
}

// =====================
// SETTINGS PAGE
// =====================
function renderSettings() {
  const content = document.getElementById('main-content');
  content.innerHTML = `
    <div class="card">
      <div class="card-header"><div class="card-title">⚙️ App Settings</div></div>
      ${[
        ['AI Model', 'Groq · llama-3.3-70b-versatile'],
        ['Data Layer', 'Wire by Anakin'],
        ['Cricket Source', 'ESPNcricinfo via Wire'],
        ['Market Data', 'Groww via Wire'],
        ['Timezone', 'Asia/Kolkata (IST)'],
      ].map(([label, val]) => `
        <div style="display:flex;justify-content:space-between;align-items:center;padding:14px 0;border-bottom:1px solid var(--border)">
          <span style="font-size:0.875rem;color:var(--text2)">${label}</span>
          <span style="font-size:0.875rem;font-weight:500">${val}</span>
        </div>`).join('')}
    </div>
    <div class="card">
      <div class="card-header"><div class="card-title">🔔 Notification Preferences</div></div>
      ${[
        ['Live cricket alerts', true],
        ['Price drop alerts', true],
        ['Job match alerts', true],
        ['Market movement', true],
        ['Reddit trending', false],
      ].map(([label, on]) => `
        <div style="display:flex;justify-content:space-between;align-items:center;padding:14px 0;border-bottom:1px solid var(--border)">
          <span style="font-size:0.875rem;color:var(--text2)">${label}</span>
          <div onclick="this.style.background=this.style.background===''?'var(--surface3)':''" style="width:36px;height:20px;border-radius:100px;background:${on ? 'var(--accent)' : 'var(--surface3)'};cursor:pointer;position:relative;transition:background 0.2s">
            <div style="position:absolute;top:3px;left:${on ? '19' : '3'}px;width:14px;height:14px;border-radius:50%;background:#fff;transition:left 0.2s"></div>
          </div>
        </div>`).join('')}
    </div>`;
}

// =====================
// PANEL
// =====================
function renderPanel(type = 'recent') {
  const items = panelData[type] || [];
  const panel = document.getElementById('panel-content');
  if (!panel) return;
  panel.innerHTML = items.map(item => `
    <div class="person-card" style="margin-bottom:10px;cursor:pointer;">
      <div class="person-avatar" style="background:${item.color};width:32px;height:32px;font-size:0.8rem;color:#fff;display:flex;align-items:center;justify-content:center;border-radius:50%;flex-shrink:0;">
        ${item.initials}
      </div>
      <div class="person-details">
        <div class="person-name" style="font-size:0.825rem">${item.name}</div>
        <div class="person-handle">${item.handle} · ${item.time}</div>
        <div class="person-summary">${item.summary}</div>
      </div>
    </div>`).join('');
}

function switchPanelTab(el, type) {
  document.querySelectorAll('.panel-tab').forEach(t => t.classList.remove('active'));
  el.classList.add('active');
  renderPanel(type);
}

function refreshAll() {
  const btn = document.getElementById('refresh-btn');
  btn.textContent = '⟳ Syncing...';
  btn.disabled = true;
  fetchAllLiveData().finally(() => {
    btn.textContent = '⟳ Refresh';
    btn.disabled = false;
  });
}

// =====================
// INIT
// =====================
document.querySelectorAll('[data-page]').forEach(item => {
  item.addEventListener('click', () => setPage(item.dataset.page));
});

setPage('digest');
renderPanel('recent');

// Auto-fetch cricket on load
setTimeout(() => fetchCricket(), 1000);
