import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'HTV Conversational Trainer',
  description: 'Realistische rollenspellen en conversatietraining voor studenten Handhaving, Toezicht en Veiligheid',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="nl">
      <body className="bg-gray-100 min-h-screen" suppressHydrationWarning={true}>
        {children}
      </body>
    </html>
  )
} 