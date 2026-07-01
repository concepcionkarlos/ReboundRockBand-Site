'use client'

// Informational-only section. There is no email backend anymore — this simply
// explains how to receive booking@reboundrockband.com in a personal inbox by
// turning on Email Forwarding in Squarespace (where the domain lives).

export default function AdminEmail() {
  const steps = [
    'Entra a account.squarespace.com e inicia sesión.',
    'Abre Domains y selecciona reboundrockband.com.',
    'Ve a la sección Email → Email Forwarding.',
    'Crea un reenvío: booking@reboundrockband.com → tu correo personal (Yahoo).',
    'Guarda. Squarespace ajusta los registros automáticamente.',
  ]

  return (
    <div className="max-w-3xl">
      {/* Header */}
      <div className="border-l-2 border-brand-red pl-4 mb-8">
        <h1 className="font-display uppercase text-4xl text-white leading-none">Email</h1>
        <p className="font-body text-xs text-white/30 mt-1.5">Cómo recibir las solicitudes en tu correo</p>
      </div>

      {/* Status */}
      <div className="border border-yellow-400/25 bg-yellow-400/[0.04] px-5 py-4 mb-6 flex items-start gap-3">
        <span className="w-2 h-2 rounded-full bg-yellow-400 flex-shrink-0 mt-1.5" />
        <div>
          <p className="font-heading text-xs uppercase tracking-widest text-yellow-400 mb-1">Pendiente de activar</p>
          <p className="font-body text-sm text-white/60 leading-relaxed">
            El reenvío de correo del dominio todavía no está activado, por eso los correos a
            booking@reboundrockband.com aún no llegan a tu buzón. Mientras tanto, cada solicitud
            de <strong className="text-white/80">Booking</strong> y de <strong className="text-white/80">Song Requests</strong> se
            guarda en el panel — no se pierde nada.
          </p>
        </div>
      </div>

      {/* What to do */}
      <div className="border border-white/8 bg-[#0d0d1e] p-6 mb-6">
        <h2 className="font-heading text-xs uppercase tracking-widest text-white mb-2">Para que te lleguen a tu correo</h2>
        <p className="font-body text-sm text-white/50 leading-relaxed mb-5">
          Activa el <strong className="text-white/80">Email Forwarding</strong> en Squarespace, donde está registrado
          el dominio. Así, todo lo que llegue a{' '}
          <span className="text-brand-red">booking@reboundrockband.com</span> se reenvía automáticamente a tu correo.
        </p>
        <ol className="flex flex-col gap-3">
          {steps.map((s, i) => (
            <li key={i} className="flex gap-3 items-start">
              <span className="font-display text-base text-brand-red w-6 flex-shrink-0 leading-none pt-0.5">{i + 1}</span>
              <span className="font-body text-sm text-white/70 leading-relaxed">{s}</span>
            </li>
          ))}
        </ol>
      </div>

      {/* Alias diagram */}
      <div className="border border-white/8 bg-[#0d0d1e] p-6">
        <h2 className="font-heading text-xs uppercase tracking-widest text-white mb-4">El reenvío</h2>
        <div className="flex items-center gap-3 flex-wrap">
          <span className="font-body text-sm border border-brand-red/30 text-brand-red px-3 py-2">booking@reboundrockband.com</span>
          <svg className="w-5 h-5 text-white/30 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
          </svg>
          <span className="font-body text-sm border border-white/10 text-white/60 px-3 py-2">tu correo personal (Yahoo)</span>
        </div>
        <p className="font-body text-xs text-white/30 mt-5 leading-relaxed">
          Nota: el reenvío sirve para <strong className="text-white/50">recibir</strong>. Que la web mande
          confirmaciones automáticas o poder <strong className="text-white/50">enviar</strong> desde
          booking@ es una función aparte que se puede activar más adelante con un servicio de correo.
        </p>
      </div>
    </div>
  )
}
