/**
 * Visit counter Worker for mrunal77.github.io
 * Endpoints:
 *   GET /up   — increment once and return { count }
 *   GET /     — return current { count } without incrementing
 */

const COUNTER_KEY = 'homepage';

const ALLOWED_ORIGINS = [
  'https://mrunal77.github.io',
  'https://mrunal.vercel.app',
  'http://localhost:5500',
  'http://127.0.0.1:5500',
  'http://localhost:3000',
  'http://127.0.0.1:3000',
];

function corsHeaders(origin) {
  const allowOrigin = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  return {
    'Access-Control-Allow-Origin': allowOrigin,
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
    Vary: 'Origin',
  };
}

function jsonResponse(body, origin, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
      ...corsHeaders(origin),
    },
  });
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get('Origin') || '';

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: corsHeaders(origin) });
    }

    if (request.method !== 'GET') {
      return jsonResponse({ error: 'Method not allowed' }, origin, 405);
    }

    if (!env.COUNTER) {
      return jsonResponse({ error: 'KV binding missing' }, origin, 500);
    }

    const url = new URL(request.url);
    const path = url.pathname.replace(/\/+$/, '') || '/';
    const shouldIncrement = path === '/up' || url.searchParams.get('action') === 'up';

    try {
      let count = parseInt(await env.COUNTER.get(COUNTER_KEY), 10);
      if (Number.isNaN(count)) count = 0;

      if (shouldIncrement) {
        count += 1;
        await env.COUNTER.put(COUNTER_KEY, String(count));
      }

      return jsonResponse({ count }, origin);
    } catch (err) {
      return jsonResponse({ error: 'Counter failed', detail: String(err) }, origin, 500);
    }
  },
};
