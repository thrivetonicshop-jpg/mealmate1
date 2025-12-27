'use client'

import Link from 'next/link'
import { 
  ChefHat, Users, ShoppingCart, Calendar, Sparkles, Check,
  ArrowRight, Refrigerator, Clock, Leaf
} from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <ChefHat className="w-8 h-8 text-brand-600" />
              <span className="text-xl font-bold text-gray-900">BestMealMate</span>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/login" className="text-gray-600 hover:text-gray-900 font-medium">
                Sign In
              </Link>
              <Link 
                href="/onboarding" 
                className="bg-brand-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-brand-700 transition-colors"
              >
                Get Started Free
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl sm:text-6xl font-extrabold text-gray-900 leading-tight mb-6">
            Meal planning for
            <span className="text-brand-600"> real families</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Different tastes. Allergies. Picky eaters. Expiring food. The endless "what's for dinner?" question. 
            <span className="font-semibold text-gray-900"> We solve all of it.</span>
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/onboarding" 
              className="bg-brand-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-brand-700 transition-colors flex items-center justify-center gap-2"
            >
              Start Planning Free
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
          <p className="mt-4 text-sm text-gray-500">No credit card required</p>
        </div>
      </section>

      {/* Pain Points */}
      <section className="py-20 bg-gray-50 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Sound familiar?</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Users, title: "Different diets", desc: "Dad wants keto, kids hate vegetables" },
              { icon: Refrigerator, title: "Food goes bad", desc: "Bought chicken Tuesday. Is it still good?" },
              { icon: Clock, title: "No time to plan", desc: "By 5pm deciding dinner feels impossible" },
              { icon: ShoppingCart, title: "Grocery chaos", desc: "You already had onions. Now you have 12" },
            ].map((item, i) => (
              <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mb-4">
                  <item.icon className="w-6 h-6 text-red-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">BestMealMate handles everything</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Users, title: "Family Profiles", desc: "Each person gets allergies, restrictions, preferences. AI plans for everyone." },
              { icon: Refrigerator, title: "Smart Pantry", desc: "Scan your fridge. Prioritize expiring ingredients. Never buy duplicates." },
              { icon: Sparkles, title: "AI Chef", desc: "Open at 5pm. Get tonight's dinner instantly. No decisions required." },
              { icon: ShoppingCart, title: "Smart Grocery List", desc: "Auto-generated, consolidated, organized by aisle." },
              { icon: Calendar, title: "Schedule-Aware", desc: "Busy day = quick meals. Sunday = batch cooking." },
              { icon: Leaf, title: "Zero Waste", desc: "Track waste. See it go down. Save money." },
            ].map((item, i) => (
              <div key={i} className="p-6 rounded-2xl border border-gray-200 hover:border-brand-300 hover:shadow-lg transition-all">
                <div className="w-12 h-12 bg-brand-100 rounded-xl flex items-center justify-center mb-4">
                  <item.icon className="w-6 h-6 text-brand-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 bg-gray-50 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Simple pricing</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Free */}
            <div className="bg-white p-8 rounded-2xl border border-gray-200">
              <h3 className="text-lg font-semibold mb-2">Free</h3>
              <div className="mb-4">
                <span className="text-4xl font-bold">$0</span>
                <span className="text-gray-500">/month</span>
              </div>
              <ul className="space-y-3 mb-8">
                {["1 family member", "Basic meal plans", "5 recipes/week"].map((f, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
                    <Check className="w-4 h-4 text-brand-600" />{f}
                  </li>
                ))}
              </ul>
              <Link href="/onboarding" className="block w-full py-3 text-center border border-gray-300 rounded-lg font-medium hover:bg-gray-50">
                Get Started
              </Link>
            </div>
            
            {/* Premium */}
            <div className="bg-white p-8 rounded-2xl border-2 border-brand-500 relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-brand-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
                Most Popular
              </div>
              <h3 className="text-lg font-semibold mb-2">Premium</h3>
              <div className="mb-4">
                <span className="text-4xl font-bold">$9.99</span>
                <span className="text-gray-500">/month</span>
              </div>
              <ul className="space-y-3 mb-8">
                {["Up to 4 members", "AI chef", "Smart grocery list", "Pantry tracking"].map((f, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
                    <Check className="w-4 h-4 text-brand-600" />{f}
                  </li>
                ))}
              </ul>
              <Link href="/onboarding?plan=premium" className="block w-full py-3 text-center bg-brand-600 text-white rounded-lg font-medium hover:bg-brand-700">
                Start Free Trial
              </Link>
            </div>
            
            {/* Family */}
            <div className="bg-white p-8 rounded-2xl border border-gray-200">
              <h3 className="text-lg font-semibold mb-2">Family</h3>
              <div className="mb-4">
                <span className="text-4xl font-bold">$14.99</span>
                <span className="text-gray-500">/month</span>
              </div>
              <ul className="space-y-3 mb-8">
                {["Unlimited members", "Calendar sync", "Hands-free cooking", "Batch planning"].map((f, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
                    <Check className="w-4 h-4 text-brand-600" />{f}
                  </li>
                ))}
              </ul>
              <Link href="/onboarding?plan=family" className="block w-full py-3 text-center border border-gray-300 rounded-lg font-medium hover:bg-gray-50">
                Start Free Trial
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-gray-200 px-4">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <ChefHat className="w-6 h-6 text-brand-600" />
            <span className="font-semibold">BestMealMate</span>
          </div>
          <p className="text-gray-400 text-sm">© 2025 BestMealMate</p>
        </div>
      </footer>
    </div>
  )
}
