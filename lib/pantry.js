import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);

export async function addItemsToPantry(items, userId) {
  if (!items || items.length === 0) {
    return { success: false, added: 0, errors: ["No items to add"] };
  }

  if (!userId) {
    return { success: false, added: 0, errors: ["User not authenticated"] };
  }

  const results = {
    success: true,
    added: 0,
    errors: [],
  };

  const pantryItems = items.map((item) => ({
    user_id: userId,
    name: item.name,
    quantity: item.quantity || "1",
    category: item.category || "other",
    freshness: item.freshness || "unknown",
    added_date: new Date().toISOString(),
    expiry_date: calculateExpiryDate(item.category, item.freshness),
    source: "ai_scanner",
    confidence: item.confidence || null,
  }));

  const { data, error } = await supabase
    .from("pantry_items")
    .insert(pantryItems)
    .select();

  if (error) {
    results.success = false;
    results.errors.push(error.message);
  } else {
    results.added = data.length;
  }

  return results;
}

export async function getPantryItems(userId) {
  const { data, error } = await supabase
    .from("pantry_items")
    .select("*")
    .eq("user_id", userId)
    .order("added_date", { ascending: false });

  if (error) {
    console.error("Failed to fetch pantry items:", error);
    return [];
  }

  return data;
}

export async function getExpiringItems(userId) {
  const threeDaysFromNow = new Date();
  threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3);

  const { data, error } = await supabase
    .from("pantry_items")
    .select("*")
    .eq("user_id", userId)
    .lte("expiry_date", threeDaysFromNow.toISOString())
    .gte("expiry_date", new Date().toISOString())
    .order("expiry_date", { ascending: true });

  if (error) {
    console.error("Failed to fetch expiring items:", error);
    return [];
  }

  return data;
}

export async function removeFromPantry(itemId, userId) {
  const { error } = await supabase
    .from("pantry_items")
    .delete()
    .eq("id", itemId)
    .eq("user_id", userId);

  if (error) {
    console.error("Failed to remove pantry item:", error);
    return false;
  }

  return true;
}

function calculateExpiryDate(category, freshness) {
  const now = new Date();
  let daysToAdd = 7;

  const categoryDays = {
    produce: 5,
    dairy: 7,
    protein: 3,
    grain: 30,
    condiment: 90,
    beverage: 14,
    snack: 30,
    frozen: 90,
    canned: 365,
    other: 14,
  };

  daysToAdd = categoryDays[category] || 7;

  if (freshness === "expiring-soon") {
    daysToAdd = Math.min(daysToAdd, 2);
  } else if (freshness === "expired") {
    daysToAdd = 0;
  }

  now.setDate(now.getDate() + daysToAdd);
  return now.toISOString();
}
