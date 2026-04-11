'use client'

import { useState } from 'react'
import Image from 'next/image'

interface AdminLoginProps {
  onLogin: (password: string) => boolean
}

export default function AdminLogin({ onLogin }: AdminLoginProps) {
  const [password, setPassword] = useState('')
  const [error, setError] = useState(false)
  const [shake, setShake] = useState(false)

  const attempt = () => {
    const ok = onLogin(password)
    if (!ok) {
      setError(true)
      setShake(true)
      setPassword('')
      setTimeout(() => setShake(false), 600)
    }
  }

  return (
    <div className="min-h-screen bg-[#07070f] flex flex-col items-center justify-center px-5">
      {/* Atmospheric glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] rounded-full bg-brand-red/5 blur-[120px] pointer-events-none" />

      <div
        className={`relative w-full max-w-sm transition-transform ${shake ? 'animate-[shake_0.5s_ease]' : ''}`}
        style={shake ? {
          animation: 'shake 0.5s ease'
        } : {}}
      >
        {/* Logo */}
        <div className="flex flex-col items-center mb-10">
          <div className="relative w-16 h-16 mb-5">
            <Image src="/logo-improved.png" alt="Rebound Rock Band" fill className="object-contain" />
          </div>
          <div className="font-display uppercase text-white text-xl leading-none tracking-wide text-center">
            Rebound <span className="text-brand-red">Rock Band</span>
          </div>
          <div className="font-heading text-[10px] uppercase tracking-[0.22em] text-white/20 mt-1.5">
            Admin Access
          </div>
        </div>

        {/* Form */}
        <div className="border border-white/8 bg-[#0a0a18] p-8">
          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <label className="font-heading text-[10px] uppercase tracking-widest text-white/35">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(false) }}
                onKeyDown={(e) => e.key === 'Enter' && attempt()}
                autoFocus
                className={`w-full bg-[#0d0d1e] border text-white font-body text-sm px-4 py-3 focus:outline-none transition-all placeholder:text-white/20 rounded-none ${
                  error
                    ? 'border-red-500/60 focus:border-red-500/80'
                    : 'border-white/8 focus:border-brand-red/50 focus:shadow-[0_0_0_3px_rgba(224,16,30,0.07)]'
                }`}
                placeholder="Enter admin password"
              />
              {error && (
                <p className="font-body text-xs text-red-400/80">
                  Incorrect password. Please try again.
                </p>
              )}
            </div>

            <button
              onClick={attempt}
              className="font-heading text-xs uppercase tracking-widest bg-brand-red text-white px-6 py-3 hover:bg-brand-red-bright transition-all btn-glow-red"
            >
              Enter Admin
            </button>
          </div>
        </div>

        {/* Back to site */}
        <div className="text-center mt-6">
          <a
            href="/"
            className="font-heading text-[10px] uppercase tracking-widest text-white/20 hover:text-white/50 transition-colors"
          >
            ← Back to Public Site
          </a>
        </div>
      </div>

      <style jsx>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          15% { transform: translateX(-8px); }
          30% { transform: translateX(8px); }
          45% { transform: translateX(-6px); }
          60% { transform: translateX(6px); }
          75% { transform: translateX(-3px); }
          90% { transform: translateX(3px); }
        }
      `}</style>
    </div>
  )
}
