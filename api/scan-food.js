const Anthropic = require("@anthropic-ai/sdk").default;

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { image, apiKey } = req.body;

    if (!image) {
      return res.status(400).json({ error: "No image provided" });
    }

    const claudeApiKey = apiKey || process.env.CLAUDE_API_KEY;

    if (!claudeApiKey) {
      return res.status(401).json({
        error: "Claude API key required. Please add your API key in settings.",
      });
    }

    const anthropic = new Anthropic({ apiKey: claudeApiKey });

    const base64Match = image.match(/^data:([^;]+);base64,(.+)$/);
    if (!base64Match) {
      return res.status(400).json({ error: "Invalid image format" });
    }

    const mediaType = base64Match[1];
    const base64Data = base64Match[2];

    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1024,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "image",
              source: {
                type: "base64",
                media_type: mediaType,
                data: base64Data,
              },
            },
            {
              type: "text",
              text: `You are a food recognition assistant for a meal planning app. Analyze this image and identify all food items, ingredients, and groceries you can see.

For each item, provide:
1. Name of the item
2. Estimated quantity (if visible)
3. Category (produce, dairy, protein, grain, condiment, beverage, snack, frozen, canned, other)
4. Freshness status if applicable (fresh, expiring-soon, expired, unknown)

Respond ONLY with a valid JSON array in this exact format, no other text:
[
  {
    "name": "item name",
    "quantity": "estimated amount",
    "category": "category",
    "freshness": "status",
    "confidence": 0.95
  }
]

If you cannot identify any food items, respond with an empty array: []`,
            },
          ],
        },
      ],
    });

    const responseText = response.content[0].text;

    let ingredients = [];
    try {
      const jsonMatch = responseText.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        ingredients = JSON.parse(jsonMatch[0]);
      }
    } catch (parseError) {
      console.error("Failed to parse ingredients:", parseError);
      return res.status(500).json({ error: "Failed to parse food items from image" });
    }

    return res.status(200).json({
      success: true,
      ingredients,
      count: ingredients.length,
    });

  } catch (error) {
    console.error("Food scan error:", error);

    if (error.status === 401) {
      return res.status(401).json({
        error: "Invalid API key. Please check your Claude API key.",
      });
    }

    return res.status(500).json({
      error: "Failed to analyze image. Please try again.",
    });
  }
};
