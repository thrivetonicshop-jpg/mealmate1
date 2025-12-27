'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { ChefHat, ArrowRight, ArrowLeft, Plus, X, AlertCircle, Sparkles, Check } from 'lucide-react'
import toast from 'react-hot-toast'

interface FamilyMember {
  id: string
  name: string
  age: string
  isPicky: boolean
  allergies: string[]
  restrictions: string[]
}

const ALLERGIES = ['Nuts', 'Peanuts', 'Dairy', 'Eggs', 'Shellfish', 'Fish', 'Soy', 'Wheat/Gluten', 'Sesame']
const RESTRICTIONS = ['Vegetarian', 'Vegan', 'Halal', 'Kosher', 'Keto', 'Paleo', 'Low Sodium', 'Low Sugar']

export default function OnboardingPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([
    { id: '1', name: '', age: '', isPicky: false, allergies: [], restrictions: [] }
  ])
  const [isLoading, setIsLoading] = useState(false)

  const addMember = () => {
    setFamilyMembers([...familyMembers, { id: Date.now().toString(), name: '', age: '', isPicky: false, allergies: [], restrictions: [] }])
  }

  const removeMember = (id: string) => {
    if (familyMembers.length > 1) setFamilyMembers(familyMembers.filter(m => m.id !== id))
  }

  const updateMember = (id: string, field: keyof FamilyMember, value: any) => {
    setFamilyMembers(familyMembers.map(m => m.id === id ? { ...m, [field]: value } : m))
  }

  const toggleItem = (id: string, field: 'allergies' | 'restrictions', item: string) => {
    setFamilyMembers(familyMembers.map(m => {
      if (m.id !== id) return m
      const arr = m[field]
      return { ...m, [field]: arr.includes(item) ? arr.filter(i => i !== item) : [...arr, item] }
    }))
  }

  const handleSubmit = async () => {
    setIsLoading(true)
    await new Promise(resolve => setTimeout(resolve, 1500))
    toast.success('Welcome to BestMealMate!')
    router.push('/dashboard')
  }

  const canProceed = () => {
    if (step === 4) return email && password.length >= 6
    if (step === 5) return familyMembers.every(m => m.name.trim())
    return true
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-brand-50 to-white">
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ChefHat className="w-7 h-7 text-brand-600" />
            <span className="text-lg font-bold">BestMealMate</span>
          </div>
          {step > 3 && (
            <div className="flex gap-2">
              {[4, 5, 6].map(s => (
                <div key={s} className={`w-2 h-2 rounded-full ${s <= step ? 'bg-brand-600' : 'bg-gray-200'}`} />
              ))}
            </div>
          )}
        </div>
      </header>

      <main className="pt-20 pb-32 px-4">
        <div className="max-w-2xl mx-auto">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div key="1" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="text-center pt-16">
                <h1 className="text-4xl font-bold mb-8">Feeding a family is <span className="text-red-500">exhausting.</span></h1>
                <div className="space-y-4 text-left max-w-md mx-auto">
                  {["Different tastes, allergies, picky eaters", "Food rotting in the fridge", "The endless 'what's for dinner?' question"].map((item, i) => (
                    <div key={i} className="flex items-start gap-3 text-lg text-gray-600">
                      <AlertCircle className="w-6 h-6 text-red-400 mt-0.5" /><span>{item}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div key="2" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="text-center pt-16">
                <h1 className="text-4xl font-bold mb-8">You're not a bad cook.<br /><span className="text-brand-600">You're just juggling too much.</span></h1>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div key="3" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="text-center pt-16">
                <div className="w-16 h-16 bg-brand-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Sparkles className="w-8 h-8 text-brand-600" />
                </div>
                <h1 className="text-4xl font-bold mb-4">BestMealMate plans around<br /><span className="text-brand-600">your family — and your fridge.</span></h1>
                <div className="space-y-3 text-left max-w-md mx-auto my-12">
                  {["One plan that works for everyone", "Uses what you already have", "Knows who can eat what"].map((item, i) => (
                    <div key={i} className="flex items-center gap-3 text-lg text-gray-700">
                      <Check className="w-6 h-6 text-brand-600" /><span>{item}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {step === 4 && (
              <motion.div key="4" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="pt-8">
                <h2 className="text-3xl font-bold mb-8 text-center">Let's get you set up</h2>
                <div className="space-y-4 max-w-md mx-auto">
                  <div>
                    <label className="block text-sm font-medium mb-1">Email</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-brand-500 outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Password</label>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="At least 6 characters" className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-brand-500 outline-none" />
                  </div>
                </div>
              </motion.div>
            )}

            {step === 5 && (
              <motion.div key="5" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="pt-8">
                <h2 className="text-3xl font-bold mb-8 text-center">Who's in your family?</h2>
                <div className="space-y-4 max-w-md mx-auto">
                  {familyMembers.map((member) => (
                    <div key={member.id} className="flex items-center gap-3">
                      <input type="text" value={member.name} onChange={(e) => updateMember(member.id, 'name', e.target.value)} placeholder="Name" className="flex-1 px-4 py-3 rounded-xl border border-gray-300 focus:border-brand-500 outline-none" />
                      <input type="number" value={member.age} onChange={(e) => updateMember(member.id, 'age', e.target.value)} placeholder="Age" className="w-20 px-4 py-3 rounded-xl border border-gray-300 outline-none" />
                      {familyMembers.length > 1 && (
                        <button onClick={() => removeMember(member.id)} className="p-2 text-gray-400 hover:text-red-500"><X className="w-5 h-5" /></button>
                      )}
                    </div>
                  ))}
                  <button onClick={addMember} className="w-full py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 hover:border-brand-400 flex items-center justify-center gap-2">
                    <Plus className="w-5 h-5" />Add another person
                  </button>
                </div>
              </motion.div>
            )}

            {step === 6 && (
              <motion.div key="6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="pt-8">
                <h2 className="text-3xl font-bold mb-8 text-center">Any dietary needs?</h2>
                <div className="space-y-8 max-w-lg mx-auto">
                  {familyMembers.filter(m => m.name.trim()).map((member) => (
                    <div key={member.id} className="bg-white rounded-2xl p-6 border border-gray-200">
                      <h3 className="font-semibold mb-4">{member.name}</h3>
                      <div className="mb-4">
                        <p className="text-sm font-medium mb-2">Allergies</p>
                        <div className="flex flex-wrap gap-2">
                          {ALLERGIES.map(a => (
                            <button key={a} onClick={() => toggleItem(member.id, 'allergies', a)} className={`px-3 py-1 rounded-full text-sm ${member.allergies.includes(a) ? 'bg-red-100 text-red-700 border-2 border-red-300' : 'bg-gray-100 text-gray-600'}`}>
                              {a}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-medium mb-2">Dietary restrictions</p>
                        <div className="flex flex-wrap gap-2">
                          {RESTRICTIONS.map(r => (
                            <button key={r} onClick={() => toggleItem(member.id, 'restrictions', r)} className={`px-3 py-1 rounded-full text-sm ${member.restrictions.includes(r) ? 'bg-brand-100 text-brand-700 border-2 border-brand-300' : 'bg-gray-100 text-gray-600'}`}>
                              {r}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      <footer className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          {step > 1 ? (
            <button onClick={() => setStep(step - 1)} className="flex items-center gap-2 px-4 py-2 text-gray-600">
              <ArrowLeft className="w-5 h-5" />Back
            </button>
          ) : <div />}
          
          {step < 6 ? (
            <button onClick={() => canProceed() && setStep(step + 1)} disabled={!canProceed()} className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium ${canProceed() ? 'bg-brand-600 text-white hover:bg-brand-700' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}>
              {step < 4 ? 'Continue' : 'Next'}<ArrowRight className="w-5 h-5" />
            </button>
          ) : (
            <button onClick={handleSubmit} disabled={isLoading} className="flex items-center gap-2 px-6 py-3 bg-brand-600 text-white rounded-xl font-medium hover:bg-brand-700 disabled:opacity-50">
              {isLoading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <><Sparkles className="w-5 h-5" />Generate My Meal Plan</>}
            </button>
          )}
        </div>
      </footer>
    </div>
  )
}
