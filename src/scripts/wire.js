/**
 * wire.js — LifeSync Wire Integration Layer
 *
 * Wire gives you a direct line into websites that normally
 * require a browser, a logged-in session, and a lot of prayer.
 *
 * Usage: import { wire } from './wire.js'
 * Then: const data = await wire.fetch('linkedin', 'get_profile_views', credentials)
 */

const WIRE_BASE_URL = 'https://api.useanakin.com/wire/v1'; // Replace with actual Wire endpoint

// =====================
// WIRE CLIENT
// =====================
export const wire = {
  /**
   * Fetch data from any Wire-supported site
   * @param {string} platform - e.g. 'linkedin', 'reddit', 'twitter', 'amazon'
   * @param {string} action   - e.g. 'get_profile_views', 'get_saved_posts'
   * @param {object} creds    - { username, password } or { cookie, token }
   * @param {object} params   - action-specific params
   */
  async fetch(platform, action, creds, params = {}) {
    const res = await fetch(`${WIRE_BASE_URL}/actions/${platform}/${action}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Wire-Api-Key': 'ask_382c073a81fa5d1a70cde5feb3dfb6fdda7132e6262b102fc5bc2823d9f5bcaf',
      },
      body: JSON.stringify({ credentials: creds, params }),
    });

    if (!res.ok) throw new Error(`Wire error: ${res.status} ${res.statusText}`);
    return res.json(); // Clean structured JSON, always
  },
};

// =====================
// PLATFORM ACTIONS
// =====================

/**
 * LinkedIn — Pull profile views, connections, job matches
 */
export async function getLinkedInDigest(creds) {
  const [views, jobs, connections] = await Promise.all([
    wire.fetch('linkedin', 'get_profile_views', creds),
    wire.fetch('linkedin', 'get_job_recommendations', creds, { limit: 5 }),
    wire.fetch('linkedin', 'get_new_connections', creds),
  ]);

  return { views, jobs, connections };
}

/**
 * Reddit — Get saved posts, comment karma, trending in followed subs
 */
export async function getRedditDigest(creds) {
  const [saved, karma, trending] = await Promise.all([
    wire.fetch('reddit', 'get_saved_posts', creds, { limit: 10 }),
    wire.fetch('reddit', 'get_recent_karma', creds),
    wire.fetch('reddit', 'get_trending_in_followed', creds),
  ]);

  return { saved, karma, trending };
}

/**
 * Twitter — Get mentions, replies, trending from following
 */
export async function getTwitterDigest(creds) {
  return wire.fetch('twitter', 'get_activity_summary', creds, { hours: 24 });
}

/**
 * Amazon — Get wishlist price drops
 */
export async function getAmazonAlerts(creds) {
  return wire.fetch('amazon', 'get_wishlist_price_drops', creds, {
    threshold: 0.1, // alert if >10% drop
  });
}

/**
 * People Intel — Research a public profile
 * @param {string} handle - Twitter handle, LinkedIn URL, or Reddit username
 */
export async function getPeopleIntel(handle, platform, followerCreds = null) {
  // Determine source
  const isPublic = !followerCreds;

  if (platform === 'twitter') {
    return wire.fetch('twitter', 'get_public_profile', null, {
      handle,
      include_recent_tweets: true,
      include_pinned: true,
      max_tweets: 30,
    });
  }

  if (platform === 'linkedin') {
    // Can only fetch if connected or public profile
    return wire.fetch('linkedin', 'get_public_profile', followerCreds, {
      profile_url: handle,
      include_activity: true,
      include_posts: true,
    });
  }

  if (platform === 'reddit') {
    return wire.fetch('reddit', 'get_user_profile', null, {
      username: handle,
      include_comments: true,
      include_posts: true,
      limit: 25,
    });
  }

  throw new Error(`Platform "${platform}" not supported for People Intel`);
}

// =====================
// CLAUDE SUMMARISER
// =====================

/**
 * Turn raw Wire data into a clean AI-written digest
 */
export async function generateDailyDigest(wireData) {
  const prompt = `
You are LifeSync's AI assistant. Based on the following real-time data pulled from the user's accounts via Wire, write a concise and friendly morning briefing. Be specific, actionable, and warm. No bullet points — write in natural paragraphs. Highlight the most important things first.

Data:
${JSON.stringify(wireData, null, 2)}

Write the briefing:
  `.trim();

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1000,
      messages: [{ role: 'user', content: prompt }],
    }),
  });

  const data = await res.json();
  return data.content[0].text;
}

/**
 * Generate a People Intel report about a person
 */
export async function generatePeopleReport(profileData, context = '') {
  const prompt = `
You are LifeSync's People Intel module. Based on the following public profile data, write a professional and useful summary that helps the user understand this person before a meeting, call, or collaboration.

Include:
1. Their professional identity and expertise (2-3 sentences)
2. What they're currently focused on (based on recent activity)
3. Their communication style / tone
4. 2-3 genuine conversation starters based on their content

Keep it professional, factual, and genuinely useful. Do not speculate beyond the data.

Profile Data:
${JSON.stringify(profileData, null, 2)}

${context ? `Additional context: ${context}` : ''}

Write the Intel Report:
  `.trim();

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 800,
      messages: [{ role: 'user', content: prompt }],
    }),
  });

  const data = await res.json();
  return data.content[0].text;
}



//ask_382c073a81fa5d1a70cde5feb3dfb6fdda7132e6262b102fc5bc2823d9f5bcaf   ...  this is he api key .   in the image , is it is the right place to  find wire  api