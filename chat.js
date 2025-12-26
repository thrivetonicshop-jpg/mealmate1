export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { message, pantry = [] } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }

  // Build system prompt with pantry context
  let systemPrompt = `You are MealMate AI Chef, a friendly and knowledgeable cooking assistant. You help users with:
- Recipe suggestions based on available ingredients
- Cooking tips and techniques
- Meal planning advice
- Dietary guidance (halal, vegetarian, keto, etc.)
- Food storage and expiration tips
- Reducing food waste

Be concise, practical, and encouraging. Use emojis sparingly. If asked about recipes, provide quick summaries with key ingredients and steps.`;

  if (pantry.length > 0) {
    systemPrompt += `\n\nThe user has these items in their pantry: ${pantry.join(', ')}. Prioritize suggesting recipes that use these ingredients, especially any that might be expiring soon.`;
  }

  // Try Claude API if key exists
  const apiKey = process.env.ANTHROPIC_API_KEY;
  
  if (apiKey) {
    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 500,
          system: systemPrompt,
          messages: [{ role: 'user', content: message }]
        })
      });

      if (response.ok) {
        const data = await response.json();
        const reply = data.content?.[0]?.text || 'I can help you with that!';
        return res.status(200).json({ reply });
      }
    } catch (error) {
      console.error('Claude API error:', error);
    }
  }

  // Fallback responses based on message content
  const lowerMessage = message.toLowerCase();
  let reply = '';

  // Check for specific intents
  if (lowerMessage.includes('expir') || lowerMessage.includes('use up') || lowerMessage.includes('going bad')) {
    const expiringItems = pantry.slice(0, 3).join(', ') || 'your expiring items';
    reply = `Great question about using up ${expiringItems}! Here are some ideas:\n\n🥗 **Stir-fry**: Quick and versatile - toss with garlic, soy sauce, and rice\n🍲 **Soup**: Simmer everything together with broth and seasonings\n🥪 **Wraps**: Fresh ingredients work great in tortillas with your favorite sauce\n\nWhat type of dish are you in the mood for?`;
  } 
  else if (lowerMessage.includes('quick') || lowerMessage.includes('fast') || lowerMessage.includes('15 min') || lowerMessage.includes('easy')) {
    reply = `Here are my go-to 15-minute meals:\n\n1. **Garlic Pasta** - Olive oil, garlic, chili flakes, parmesan\n2. **Egg Fried Rice** - Day-old rice, eggs, soy sauce, veggies\n3. **Quesadillas** - Tortilla, cheese, whatever protein you have\n4. **Greek Salad** - Cucumber, tomato, feta, olives, olive oil\n\nWhich sounds good to you?`;
  }
  else if (lowerMessage.includes('chicken')) {
    reply = `Chicken is so versatile! Here are my favorites:\n\n🍗 **Honey Garlic Chicken** (25 min) - Pan-seared with honey, soy sauce, garlic\n🥙 **Chicken Shawarma** (30 min) - Spiced chicken with yogurt sauce\n🍛 **Butter Chicken** (35 min) - Creamy tomato curry\n🥗 **Chicken Caesar Salad** (15 min) - Classic and satisfying\n\nWant the full recipe for any of these?`;
  }
  else if (lowerMessage.includes('vegetarian') || lowerMessage.includes('vegan') || lowerMessage.includes('plant')) {
    reply = `Love plant-based cooking! Try these:\n\n🍛 **Chickpea Curry** - Coconut milk, tomatoes, warm spices\n🥙 **Falafel Bowls** - Crispy chickpea patties with tahini\n🍝 **Pasta Primavera** - Seasonal veggies with garlic olive oil\n🌮 **Black Bean Tacos** - Seasoned beans, fresh salsa, avocado\n\nAll packed with protein and flavor!`;
  }
  else if (lowerMessage.includes('meal prep') || lowerMessage.includes('week')) {
    reply = `Smart thinking with meal prep! Here's my Sunday strategy:\n\n📦 **Proteins**: Grill chicken breasts, bake salmon, cook ground beef\n🍚 **Grains**: Make a big batch of rice and quinoa\n🥬 **Veggies**: Roast a sheet pan of mixed vegetables\n🥫 **Sauces**: Prep 2-3 sauces (teriyaki, tahini, salsa)\n\nMix and match throughout the week for variety!`;
  }
  else if (lowerMessage.includes('halal')) {
    reply = `Here are some delicious halal recipes:\n\n🥙 **Chicken Shawarma** - Marinated in yogurt and Middle Eastern spices\n🍖 **Beef Kofta** - Seasoned ground beef on skewers\n🍛 **Lamb Biryani** - Fragrant rice with tender lamb\n🥗 **Fattoush Salad** - Fresh veggies with sumac dressing\n\nAll made with halal ingredients. Which interests you?`;
  }
  else if (pantry.length > 0) {
    reply = `Based on what's in your pantry (${pantry.slice(0, 5).join(', ')}), I'd suggest:\n\n1. **Stir-fry** - Quick and uses multiple ingredients\n2. **Grain bowl** - Layer grains, protein, and veggies\n3. **Frittata** - Eggs + whatever veggies you have\n\nWant me to give you a specific recipe using these ingredients?`;
  }
  else {
    const responses = [
      "I'd love to help you cook something delicious! What ingredients do you have on hand, or what type of meal are you craving?",
      "Let's find the perfect recipe for you! Are you looking for something quick, healthy, or maybe using specific ingredients?",
      "Ready to cook! Tell me what's in your fridge or what cuisine you're in the mood for, and I'll suggest some great options.",
      "I'm here to help with meal ideas, recipes, or cooking tips. What would you like to know?"
    ];
    reply = responses[Math.floor(Math.random() * responses.length)];
  }

  return res.status(200).json({ reply });
}
