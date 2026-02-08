module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'Missing GEMINI_API_KEY env var' });
  }

  try {
    const body = await readJsonBody(req);
    const prompt = body && typeof body.prompt === 'string' ? body.prompt : '';
    if (!prompt.trim()) {
      return res.status(400).json({ error: 'Missing prompt' });
    }

    const model = process.env.GEMINI_MODEL || 'gemini-2.0-flash';
    const endpointBase =
      process.env.GEMINI_ENDPOINT ||
      'https://generativelanguage.googleapis.com/v1beta/models';

    const url = `${endpointBase}/${model}:generateContent?key=${encodeURIComponent(apiKey)}`;
    const upstream = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
      }),
    });

    const text = await upstream.text();
    res.setHeader('Cache-Control', 'no-store');
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.status(upstream.status).send(text);
  } catch (error) {
    res.setHeader('Cache-Control', 'no-store');
    res.status(500).json({ error: error?.message || 'Internal error' });
  }
}

async function readJsonBody(req) {
  if (req.body && typeof req.body === 'object') return req.body;
  const raw = await new Promise((resolve, reject) => {
    let data = '';
    req.on('data', (chunk) => (data += chunk));
    req.on('end', () => resolve(data));
    req.on('error', reject);
  });
  if (!raw) return {};
  return JSON.parse(raw);
}
