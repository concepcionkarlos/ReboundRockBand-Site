'use client'

// Informational-only section written for Pepe (~70, non-technical, old-school).
// No email backend — just a plain, friendly, step-by-step explanation of how to
// turn on Email Forwarding in Squarespace so booking@reboundrockband.com reaches
// his personal Yahoo inbox. Requests are always saved in the panel regardless.

export default function AdminEmail() {
  const steps = [
    {
      t: 'Abre internet (Chrome, Safari, el que uses) y entra a esta dirección:',
      hint: 'account.squarespace.com',
    },
    {
      t: 'Inicia sesión con tu usuario y contraseña de Squarespace.',
      hint: 'Es la misma cuenta donde está hecha la página web.',
    },
    {
      t: 'Haz clic en “Domains” y después en reboundrockband.com.',
      hint: '“Domains” quiere decir “Dominios”.',
    },
    {
      t: 'Busca la sección “Email” y entra en “Email Forwarding”.',
      hint: '“Email Forwarding” quiere decir “Reenvío de correo”.',
    },
    {
      t: 'Agrega un reenvío nuevo: en el primer espacio escribe booking y en el segundo pon tu correo de Yahoo completo.',
      hint: 'Por ejemplo:  booking  →  tucorreo@yahoo.com',
    },
    {
      t: 'Dale a “Save” (Guardar). ¡Y ya está!',
      hint: 'Desde ese momento, cada solicitud te llega también a tu Yahoo.',
    },
  ]

  return (
    <div className="max-w-3xl">
      {/* Header */}
      <div className="border-l-2 border-brand-red pl-4 mb-8">
        <h1 className="font-display uppercase text-4xl text-white leading-none">Email</h1>
        <p className="font-body text-xs text-white/30 mt-1.5">Cómo hacer que las solicitudes te lleguen a tu correo</p>
      </div>

      {/* Reassurance — nothing is lost */}
      <div className="border border-green-400/25 bg-green-400/[0.04] px-5 py-4 mb-6 flex items-start gap-3">
        <svg className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <div>
          <p className="font-heading text-xs uppercase tracking-widest text-green-400 mb-1.5">Tranquilo, Pepe — no se pierde nada</p>
          <p className="font-body text-sm text-white/60 leading-relaxed">
            Todo lo que la gente escribe en la página se <strong className="text-white/80">guarda solo</strong> aquí
            en tu panel, en las secciones <strong className="text-white/80">Booking</strong> y{' '}
            <strong className="text-white/80">Song Requests</strong>. Puedes entrar cuando quieras a verlo. No hace falta
            hacer nada para que se guarde.
          </p>
        </div>
      </div>

      {/* The one thing that's missing */}
      <div className="border border-white/8 bg-[#0d0d1e] p-6 mb-6">
        <h2 className="font-heading text-xs uppercase tracking-widest text-white mb-3">Lo único que falta (se hace una sola vez)</h2>
        <p className="font-body text-sm text-white/55 leading-relaxed mb-3">
          Falta que, además de guardarse aquí, te llegue una <strong className="text-white/80">copia a tu correo personal</strong>.
        </p>
        <p className="font-body text-sm text-white/55 leading-relaxed">
          Piénsalo como cuando te mudas de casa y le pides al cartero que las cartas de tu dirección vieja te las
          mande a la nueva. Aquí es igual: le decimos a <strong className="text-white/80">Squarespace</strong> (la empresa donde
          está registrada la página) que cada correo que llegue a{' '}
          <span className="text-brand-red">booking@reboundrockband.com</span> te lo reenvíe a tu Yahoo.
        </p>
      </div>

      {/* Steps */}
      <div className="border border-white/8 bg-[#0d0d1e] p-6 mb-6">
        <h2 className="font-heading text-xs uppercase tracking-widest text-white mb-5">Paso a paso</h2>
        <ol className="flex flex-col gap-5">
          {steps.map((s, i) => (
            <li key={i} className="flex gap-4 items-start">
              <span className="flex-shrink-0 w-7 h-7 rounded-full border border-brand-red/40 text-brand-red font-display text-base flex items-center justify-center leading-none">
                {i + 1}
              </span>
              <div className="min-w-0 pt-0.5">
                <p className="font-body text-sm text-white/80 leading-relaxed">{s.t}</p>
                <p className="font-body text-xs text-white/35 mt-1 leading-relaxed">{s.hint}</p>
              </div>
            </li>
          ))}
        </ol>
        <p className="font-body text-sm text-white/40 leading-relaxed mt-6 pt-5 border-t border-white/8">
          Si en algún paso no te aparece igual o te trabas, no te preocupes — déjalo así y pídele ayuda a quien
          te maneja la página. No se rompe nada.
        </p>
      </div>

      {/* Simple diagram */}
      <div className="border border-white/8 bg-[#0d0d1e] p-6">
        <h2 className="font-heading text-xs uppercase tracking-widest text-white mb-4">En resumen</h2>
        <div className="flex items-center gap-3 flex-wrap">
          <span className="font-body text-sm border border-brand-red/30 text-brand-red px-3 py-2">booking@reboundrockband.com</span>
          <svg className="w-5 h-5 text-white/30 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
          </svg>
          <span className="font-body text-sm border border-white/10 text-white/60 px-3 py-2">tu correo de Yahoo</span>
        </div>
        <p className="font-body text-sm text-white/45 leading-relaxed mt-5">
          Cuando actives esto, <strong className="text-white/70">todas las solicitudes nuevas te llegarán al correo</strong>.
          Las que ya están guardadas aquí en el panel se quedan igual.
        </p>
      </div>
    </div>
  )
}
