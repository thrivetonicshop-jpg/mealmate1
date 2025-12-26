export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { image } = req.body;

  if (!image) {
    return res.status(400).json({ error: 'No image provided' });
  }

  // Your API key is stored securely in Vercel environment variables
  const CLAUDE_API_KEY = process.env.CLAUDE_API_KEY;

  if (!CLAUDE_API_KEY) {
    return res.status(500).json({ error: 'API key not configured' });
  }

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': CLAUDE_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1024,
        messages: [{
          role: 'user',
          content: [
            {
              type: 'image',
              source: {
                type: 'base64',
                media_type: 'image/jpeg',
                data: image
              }
            },
            {
              type: 'text',
              text: `Identify all food items in this image. Return ONLY a JSON array:
[{"name":"Item","emoji":"🍎","category":"fruits|vegetables|dairy|meat|grains|beverages|condiments|snacks|frozen|other","quantity":"2 pieces","expiresIn":7}]
If no food, return []. No other text.`
            }
          ]
        }]
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error?.message || `API error: ${response.status}`);
    }

    const data = await response.json();
    const textContent = data.content.find(c => c.type === 'text');
    
    if (!textContent) {
      return res.status(500).json({ error: 'No response from AI' });
    }

    let items;
    try {
      let jsonStr = textContent.text.trim();
      jsonStr = jsonStr.replace(/```json\n?|```\n?/g, '');
      items = JSON.parse(jsonStr);
    } catch (e) {
      return res.status(500).json({ error: 'Failed to parse AI response' });
    }

    return res.status(200).json({ items });

  } catch (error) {
    console.error('Scan error:', error);
    return res.status(500).json({ error: error.message });
  }
}
