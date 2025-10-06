import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Code Content Generator',
  description: 'AI-powered coding problem explanations with HuggingFace',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        {children}
      </body>
    </html>
  )
}
