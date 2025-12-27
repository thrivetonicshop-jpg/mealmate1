'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ChefHat, Calendar, ShoppingCart, Refrigerator, Users, Sparkles, Plus, ChevronRight, Clock, Check, AlertTriangle, Settings, LogOut } from 'lucide-react'

const mockMealPlan = [
  { day: 'Today', meal: 'Sheet Pan Chicken & Veggies', time: '35 min' },
  { day: 'Tomorrow', meal: 'Beef Tacos', time: '25 min' },
  { day: 'Wednesday', meal: 'Pasta Primavera', time: '30 min' },
]

const mockExpiring = [
  { name: 'Chicken Breast', days: 1, location: 'Fridge' },
  { name: 'Spinach', days: 2, location: 'Fridge' },
]

const mockFamily = [
  { name: 'You', avatar: '👨' },
  { name: 'Sarah', avatar: '👩' },
  { name: 'Jake', avatar: '👦' },
]

export default function DashboardPage() {
  const [showAIChef, setShowAIChef] = useState(false)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 bottom-0 w-64 bg-white border-r border-gray-200 p-4 hidden lg:block">
        <div className="flex items-center gap-2 mb-8">
          <ChefHat className="w-8 h-8 text-brand-600" />
          <span className="text-xl font-bold">BestMealMate</span>
        </div>
        
        <nav className="space-y-1">
          {[
            { icon: Calendar, label: 'Meal Plan', active: true },
            { icon: ShoppingCart, label: 'Grocery List', active: false },
            { icon: Refrigerator, label: 'Pantry', active: false },
            { icon: ChefHat, label: 'Recipes', active: false },
            { icon: Users, label: 'Family', active: false },
          ].map((item) => (
            <button key={item.label} className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg ${item.active ? 'bg-brand-50 text-brand-700' : 'text-gray-600 hover:bg-gray-100'}`}>
              <item.icon className="w-5 h-5" /><span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>
      </aside>

      {/* Main */}
      <main className="lg:ml-64 p-4 lg:p-8">
        <header className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold">Good evening!</h1>
            <p className="text-gray-600">Here's what's cooking this week</p>
          </div>
          <button onClick={() => setShowAIChef(true)} className="flex items-center gap-2 px-4 py-2 bg-brand-600 text-white rounded-xl font-medium hover:bg-brand-700">
            <Sparkles className="w-5 h-5" />Ask AI Chef
          </button>
        </header>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Tonight's Dinner */}
            <div className="bg-gradient-to-br from-brand-600 to-brand-700 rounded-2xl p-6 text-white">
              <p className="text-brand-100 text-sm mb-1">Tonight's Dinner</p>
              <h2 className="text-2xl font-bold mb-4">{mockMealPlan[0].meal}</h2>
              <div className="flex items-center gap-2 mb-4">
                <Check className="w-5 h-5 text-brand-200" />
                <span className="text-brand-100">You have all the ingredients</span>
              </div>
              <button className="w-full bg-white text-brand-700 py-3 rounded-xl font-semibold hover:bg-brand-50">
                Start Cooking
              </button>
            </div>

            {/* This Week */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200">
              <h3 className="font-semibold mb-4">This Week</h3>
              <div className="space-y-3">
                {mockMealPlan.map((meal, i) => (
                  <div key={i} className={`flex items-center justify-between p-3 rounded-xl ${i === 0 ? 'bg-brand-50' : 'hover:bg-gray-50'}`}>
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${i === 0 ? 'bg-brand-600 text-white' : 'bg-gray-100'}`}>
                        <Calendar className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-medium">{meal.meal}</p>
                        <p className="text-sm text-gray-500">{meal.day} • {meal.time}</p>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </div>
                ))}
              </div>
            </div>

            {/* Family */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200">
              <h3 className="font-semibold mb-4">Family</h3>
              <div className="flex items-center gap-4">
                {mockFamily.map((member, i) => (
                  <div key={i} className="text-center">
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-2xl mb-1">{member.avatar}</div>
                    <p className="text-sm font-medium">{member.name}</p>
                  </div>
                ))}
                <button className="w-12 h-12 border-2 border-dashed border-gray-300 rounded-full flex items-center justify-center text-gray-400 hover:border-brand-400 hover:text-brand-600">
                  <Plus className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Expiring Soon */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200">
              <div className="flex items-center gap-2 mb-4">
                <AlertTriangle className="w-5 h-5 text-amber-500" />
                <h3 className="font-semibold">Expiring Soon</h3>
              </div>
              <div className="space-y-3">
                {mockExpiring.map((item, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-gray-500">{item.location}</p>
                    </div>
                    <span className={`text-sm font-medium ${item.days <= 1 ? 'text-red-600' : 'text-amber-600'}`}>
                      {item.days === 1 ? 'Tomorrow' : `${item.days} days`}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200">
              <h3 className="font-semibold mb-4">Quick Actions</h3>
              <div className="space-y-2">
                {[
                  { icon: Plus, label: 'Add to Pantry', color: 'brand' },
                  { icon: ChefHat, label: 'Browse Recipes', color: 'purple' },
                  { icon: ShoppingCart, label: 'Order Groceries', color: 'orange' },
                ].map((action, i) => (
                  <button key={i} className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 text-left">
                    <div className={`w-10 h-10 bg-${action.color}-100 rounded-lg flex items-center justify-center`}>
                      <action.icon className={`w-5 h-5 text-${action.color}-600`} />
                    </div>
                    <span className="font-medium text-gray-700">{action.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* AI Chef Modal */}
      {showAIChef && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl w-full max-w-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-brand-100 rounded-xl flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-brand-600" />
                </div>
                <div>
                  <h3 className="font-semibold">AI Chef</h3>
                  <p className="text-sm text-gray-500">Ask me anything about meals</p>
                </div>
              </div>
              <button onClick={() => setShowAIChef(false)} className="text-2xl text-gray-400">&times;</button>
            </div>
            
            <div className="bg-gray-50 rounded-xl p-4 mb-4">
              <p className="text-gray-600">
                Based on your pantry and family preferences, I suggest <strong>Honey Garlic Chicken</strong> for tonight. 
                It uses your chicken that expires tomorrow!
              </p>
            </div>
            
            <div className="flex gap-2 mb-4">
              <button className="px-4 py-2 bg-brand-600 text-white rounded-lg font-medium">Add to Plan</button>
              <button className="px-4 py-2 bg-gray-100 rounded-lg font-medium">Show Recipe</button>
              <button className="px-4 py-2 bg-gray-100 rounded-lg font-medium">Suggest Another</button>
            </div>
            
            <input type="text" placeholder="Ask me anything..." className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-brand-500 outline-none" />
          </div>
        </div>
      )}

      {/* Mobile Nav */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 lg:hidden">
        <div className="flex items-center justify-around py-2">
          {[
            { icon: Calendar, label: 'Plan', active: true },
            { icon: ShoppingCart, label: 'Groceries' },
            { icon: Refrigerator, label: 'Pantry' },
            { icon: ChefHat, label: 'Recipes' },
            { icon: Users, label: 'Family' },
          ].map((item) => (
            <button key={item.label} className={`flex flex-col items-center gap-1 px-3 py-1 ${item.active ? 'text-brand-600' : 'text-gray-400'}`}>
              <item.icon className="w-6 h-6" />
              <span className="text-xs font-medium">{item.label}</span>
            </button>
          ))}
        </div>
      </nav>
    </div>
  )
}
