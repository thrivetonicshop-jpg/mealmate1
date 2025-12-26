export const config = {
  runtime: 'edge',
};

export default async function handler(req) {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const { message } = await req.json();
    
    // Get API key from environment variable
    const apiKey = process.env.ANTHROPIC_API_KEY;
    
    if (!apiKey) {
      // Return a helpful fallback if no API key
      const fallbacks = [
        "I'd suggest checking what ingredients you already have! What's in your fridge?",
        "For a quick and easy meal, try pasta with olive oil, garlic, and whatever veggies you have on hand.",
        "Meal prepping on Sundays can save you hours during the week. Want some batch cooking ideas?",
        "What type of cuisine are you in the mood for? I can suggest some recipes!",
        "A simple stir-fry is always a great option - just toss your favorite protein and vegetables in a pan with some soy sauce."
      ];
      return new Response(JSON.stringify({ 
        reply: fallbacks[Math.floor(Math.random() * fallbacks.length)]
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1024,
        system: "You are MealMate's AI Chef assistant. You help users with meal planning, recipes, cooking tips, and grocery lists. Be friendly, helpful, and concise. Focus on practical, actionable advice. When suggesting recipes, consider using ingredients the user might already have. Keep responses brief but helpful - ideally 2-3 sentences unless more detail is needed.",
        messages: [
          { role: 'user', content: message }
        ],
      }),
    });

    if (!response.ok) {
      throw new Error('API request failed');
    }

    const data = await response.json();
    const reply = data.content[0].text;

    return new Response(JSON.stringify({ reply }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error:', error);
    return new Response(JSON.stringify({ 
      reply: "I'm having trouble connecting right now. Try asking about quick recipes, meal prep tips, or what to cook with ingredients you have!"
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
