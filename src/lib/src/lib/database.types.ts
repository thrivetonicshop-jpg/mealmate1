export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      households: {
        Row: {
          id: string
          name: string
          subscription_tier: 'free' | 'premium' | 'family'
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          timezone: string
          preferred_grocery_store: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name?: string
          subscription_tier?: 'free' | 'premium' | 'family'
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          timezone?: string
          preferred_grocery_store?: string | null
        }
        Update: {
          id?: string
          name?: string
          subscription_tier?: 'free' | 'premium' | 'family'
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          timezone?: string
          preferred_grocery_store?: string | null
        }
      }
      family_members: {
        Row: {
          id: string
          household_id: string
          user_id: string | null
          name: string
          age: number | null
          role: 'admin' | 'member' | 'child'
          avatar_url: string | null
          is_picky_eater: boolean
          calorie_goal: number | null
          protein_goal: number | null
          carb_goal: number | null
          fat_goal: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          household_id: string
          user_id?: string | null
          name: string
          age?: number | null
          role?: 'admin' | 'member' | 'child'
          avatar_url?: string | null
          is_picky_eater?: boolean
          calorie_goal?: number | null
        }
        Update: {
          name?: string
          age?: number | null
          role?: 'admin' | 'member' | 'child'
          is_picky_eater?: boolean
        }
      }
      pantry_items: {
        Row: {
          id: string
          household_id: string
          ingredient_id: string
          quantity: number
          unit: string | null
          location: 'fridge' | 'freezer' | 'pantry' | 'spice_rack' | 'other'
          expiry_date: string | null
          added_date: string
          is_staple: boolean
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          household_id: string
          ingredient_id: string
          quantity?: number
          unit?: string | null
          location?: 'fridge' | 'freezer' | 'pantry' | 'spice_rack' | 'other'
          expiry_date?: string | null
          is_staple?: boolean
        }
        Update: {
          quantity?: number
          expiry_date?: string | null
          is_staple?: boolean
        }
      }
      recipes: {
        Row: {
          id: string
          household_id: string | null
          name: string
          description: string | null
          cuisine: string | null
          meal_type: 'breakfast' | 'lunch' | 'dinner' | 'snack' | 'dessert' | null
          prep_time_minutes: number | null
          cook_time_minutes: number | null
          total_time_minutes: number | null
          difficulty: 'easy' | 'medium' | 'hard'
          servings: number
          calories_per_serving: number | null
          image_url: string | null
          is_kid_friendly: boolean
          is_quick_meal: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          name: string
          household_id?: string | null
          description?: string | null
          meal_type?: 'breakfast' | 'lunch' | 'dinner' | 'snack' | 'dessert' | null
          prep_time_minutes?: number | null
          cook_time_minutes?: number | null
          difficulty?: 'easy' | 'medium' | 'hard'
          servings?: number
        }
        Update: {
          name?: string
          description?: string | null
        }
      }
      ingredients: {
        Row: {
          id: string
          name: string
          category: string | null
          default_unit: string | null
          avg_shelf_life_days: number | null
          created_at: string
        }
        Insert: {
          name: string
          category?: string | null
          default_unit?: string | null
        }
        Update: {
          name?: string
          category?: string | null
        }
      }
    }
  }
}

export type Household = Database['public']['Tables']['households']['Row']
export type FamilyMember = Database['public']['Tables']['family_members']['Row']
export type Recipe = Database['public']['Tables']['recipes']['Row']
export type PantryItem = Database['public']['Tables']['pantry_items']['Row']
export type Ingredient = Database['public']['Tables']['ingredients']['Row']
