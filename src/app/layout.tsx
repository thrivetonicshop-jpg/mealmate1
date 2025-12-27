import type { Metadata } from 'next'
import { Toaster } from 'react-hot-toast'
import './globals.css'

export const metadata: Metadata = {
  title: 'BestMealMate - Family Meal Planning Made Easy',
  description: 'The smart meal planning app that knows your family. One plan. Everyone eats. Nothing wasted.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white antialiased">
        {children}
        <Toaster 
          position="top-center"
          toastOptions={{
            duration: 4000,
            style: { background: '#333', color: '#fff' },
            success: { iconTheme: { primary: '#22c55e', secondary: '#fff' } },
          }}
        />
      </body>
    </html>
  )
}
