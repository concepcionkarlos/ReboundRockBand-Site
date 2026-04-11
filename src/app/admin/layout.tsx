import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: {
    default: 'Admin — Rebound Rock Band',
    template: '%s | Admin',
  },
  robots: { index: false, follow: false },
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#07070f] text-white">
      {children}
    </div>
  )
}
