export const config = {
  runtime: 'edge',
};

export default async function handler(req) {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const { items, title } = await req.json();
    
    // Get Instacart API key from environment
    const instacartApiKey = process.env.INSTACART_API_KEY;
    
    if (!instacartApiKey) {
      // Return helpful message if no API key configured
      return new Response(JSON.stringify({ 
        error: 'Instacart integration not configured',
        message: 'Please add INSTACART_API_KEY to your environment variables',
        // Fallback: generate a basic Instacart search URL
        fallbackUrl: generateFallbackUrl(items)
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Format items for Instacart API
    const lineItems = items.map(item => ({
      name: item.name,
      quantity: item.quantity || 1,
      unit: item.unit || null,
      display_text: item.displayText || item.name
    }));

    // Call Instacart Developer Platform API
    const response = await fetch('https://connect.instacart.com/idp/v1/products/products_link', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${instacartApiKey}`,
      },
      body: JSON.stringify({
        title: title || 'MealMate Grocery List',
        link_type: 'shopping_list',
        expires_in: 7, // Link expires in 7 days
        line_items: lineItems,
        landing_page_configuration: {
          partner_linkback_url: 'https://www.bestmealmate.com',
          enable_pantry_items: true
        }
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Instacart API error:', errorData);
      throw new Error('Instacart API request failed');
    }

    const data = await response.json();
    
    return new Response(JSON.stringify({ 
      success: true,
      url: data.products_link_url || data.url,
      message: 'Shopping list created on Instacart!'
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error:', error);
    return new Response(JSON.stringify({ 
      error: 'Failed to create Instacart list',
      message: error.message,
      fallbackUrl: 'https://www.instacart.com'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

// Generate a basic Instacart search URL as fallback
function generateFallbackUrl(items) {
  if (!items || items.length === 0) {
    return 'https://www.instacart.com';
  }
  // Create a search query from first few items
  const searchTerms = items.slice(0, 3).map(i => i.name).join(' ');
  return `https://www.instacart.com/store/search/${encodeURIComponent(searchTerms)}`;
}
