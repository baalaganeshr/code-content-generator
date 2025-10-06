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
      <body className="min-h-screen bg-gradient-to-br from-black via-red-950/30 to-black">
        {children}
      </body>
    </html>
  )
}
