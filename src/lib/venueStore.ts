import fs from 'fs'
import path from 'path'
import crypto from 'crypto'
import type {
  Venue,
  OutreachLog,
  EmailTemplate,
  AutoReplyLog,
  BookingEmailLog,
  InboundEmail,
  VenueStore,
} from './data'

const VENUE_DATA_PATH = path.join(process.cwd(), 'data', 'venues.json')
const useKV = !!process.env.KV_REST_API_URL

const KV_KEYS = {
  venues: 'venues',
  outreachLogs: 'outreachLogs',
  emailTemplates: 'emailTemplates',
  autoReplyLogs: 'autoReplyLogs',
  bookingEmailLogs: 'bookingEmailLogs',
  inboundEmails: 'inboundEmails',
} as const

// ── Helpers ────────────────────────────────────────────────────────────────────

function makeId() {
  return crypto.randomBytes(8).toString('hex')
}

const now = () => new Date().toISOString()

// ── Default email templates ────────────────────────────────────────────────────

const DEFAULT_TEMPLATES: EmailTemplate[] = [
  {
    id: makeId(),
    slug: 'booking-auto-reply',
    name: 'Booking Auto-Reply',
    isSystem: true,
    createdAt: now(),
    updatedAt: now(),
    subject: 'Thanks for reaching out, {{clientName}}!',
    bodyHtml: `<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;background:#f4f4f4;font-family:Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0">
  <tr><td align="center" style="padding:40px 16px;">
    <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;max-width:600px;width:100%;">
      <tr><td style="background:#e0101e;padding:24px 40px;">
        <p style="margin:0;color:#ffffff;font-size:22px;font-weight:700;letter-spacing:2px;text-transform:uppercase;">REBOUND ROCK BAND</p>
        <p style="margin:4px 0 0;color:rgba(255,255,255,0.7);font-size:11px;letter-spacing:1px;text-transform:uppercase;">Classic Rock · South Florida</p>
      </td></tr>
      <tr><td style="padding:40px;">
        <h1 style="margin:0 0 16px;font-size:24px;color:#111111;">Thanks, {{clientName}}!</h1>
        <p style="margin:0 0 16px;font-size:15px;line-height:1.6;color:#444444;">We received your booking inquiry for <strong>{{eventType}}</strong> on <strong>{{eventDate}}</strong> and we're excited about the possibility of playing your event.</p>
        <p style="margin:0 0 16px;font-size:15px;line-height:1.6;color:#444444;">Someone from {{bandName}} will be in touch within <strong>24–48 hours</strong> to discuss availability, pricing, and how we can make your event unforgettable.</p>
        <p style="margin:0 0 32px;font-size:15px;line-height:1.6;color:#444444;">In the meantime, feel free to check out our setlists and press kit at <a href="https://reboundrockband.com" style="color:#e0101e;">reboundrockband.com</a>.</p>
        <p style="margin:0;font-size:15px;color:#444444;">Rock on,<br><strong>{{bandName}}</strong></p>
      </td></tr>
      <tr><td style="background:#f9f9f9;padding:20px 40px;border-top:1px solid #eeeeee;">
        <p style="margin:0;font-size:12px;color:#999999;line-height:1.5;">You're receiving this because you submitted a booking inquiry at reboundrockband.com.<br>This is an automated confirmation — a team member will follow up personally.</p>
      </td></tr>
    </table>
  </td></tr>
</table>
</body>
</html>`,
  },
  {
    id: makeId(),
    slug: 'booking-reply-initial',
    name: 'Booking Reply — Initial Contact',
    isSystem: true,
    createdAt: now(),
    updatedAt: now(),
    subject: 'Re: Your Booking Inquiry — Rebound Rock Band',
    bodyHtml: `<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;background:#f4f4f4;font-family:Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0">
  <tr><td align="center" style="padding:40px 16px;">
    <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;max-width:600px;width:100%;">
      <tr><td style="background:#e0101e;padding:24px 40px;">
        <p style="margin:0;color:#ffffff;font-size:22px;font-weight:700;letter-spacing:2px;text-transform:uppercase;">REBOUND ROCK BAND</p>
        <p style="margin:4px 0 0;color:rgba(255,255,255,0.7);font-size:11px;letter-spacing:1px;text-transform:uppercase;">Classic Rock · South Florida</p>
      </td></tr>
      <tr><td style="padding:40px;">
        <p style="margin:0 0 16px;font-size:15px;line-height:1.6;color:#444444;">Hi {{clientName}},</p>
        <p style="margin:0 0 16px;font-size:15px;line-height:1.6;color:#444444;">Thank you so much for reaching out to Rebound Rock Band! We're excited about the possibility of performing at your event on <strong>{{eventDate}}</strong>.</p>
        <p style="margin:0 0 16px;font-size:15px;line-height:1.6;color:#444444;">We are a five-piece live classic rock cover band based in South Florida, playing the greatest hits from the 1950s through the 1990s — Chuck Berry, The Beatles, Led Zeppelin, Queen, Bon Jovi, and more. We bring full PA, lighting, and a high-energy performance guaranteed to get the crowd moving.</p>
        <p style="margin:0 0 16px;font-size:15px;line-height:1.6;color:#444444;">I'd love to discuss the details of your event and put together a quote for you. Could you let me know a bit more about:</p>
        <ul style="margin:0 0 16px;padding-left:20px;font-size:15px;line-height:1.8;color:#444444;">
          <li>Type of event and venue</li>
          <li>Approximate number of guests</li>
          <li>How long you'd like us to perform</li>
          <li>Any special song requests or themes</li>
        </ul>
        <p style="margin:0 0 24px;font-size:15px;line-height:1.6;color:#444444;">You can also check out our full press kit and song list at <a href="https://reboundrockband.com/epk" style="color:#e0101e;">reboundrockband.com/epk</a>.</p>
        <table cellpadding="0" cellspacing="0"><tr><td style="background:#e0101e;padding:12px 24px;"><a href="mailto:{{replyEmail}}" style="color:#ffffff;font-size:14px;font-weight:700;text-decoration:none;text-transform:uppercase;letter-spacing:1px;">Reply to This Email</a></td></tr></table>
        <p style="margin:32px 0 0;font-size:15px;color:#444444;">Looking forward to making your event unforgettable,<br><strong>Jose "Pepe" Ortiz</strong><br>Band Director · Rebound Rock Band<br><a href="mailto:{{replyEmail}}" style="color:#e0101e;">{{replyEmail}}</a></p>
      </td></tr>
      <tr><td style="background:#f9f9f9;padding:20px 40px;border-top:1px solid #eeeeee;">
        <p style="margin:0;font-size:12px;color:#999999;">Rebound Rock Band · <a href="https://reboundrockband.com" style="color:#999999;">reboundrockband.com</a> · South Florida</p>
      </td></tr>
    </table>
  </td></tr>
</table>
</body>
</html>`,
  },
  {
    id: makeId(),
    slug: 'booking-reply-confirmed',
    name: 'Booking Reply — Confirmed',
    isSystem: true,
    createdAt: now(),
    updatedAt: now(),
    subject: 'Confirmed — Rebound Rock Band for {{eventDate}}!',
    bodyHtml: `<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;background:#f4f4f4;font-family:Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0">
  <tr><td align="center" style="padding:40px 16px;">
    <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;max-width:600px;width:100%;">
      <tr><td style="background:#e0101e;padding:24px 40px;">
        <p style="margin:0;color:#ffffff;font-size:22px;font-weight:700;letter-spacing:2px;text-transform:uppercase;">REBOUND ROCK BAND</p>
        <p style="margin:4px 0 0;color:rgba(255,255,255,0.7);font-size:11px;letter-spacing:1px;text-transform:uppercase;">Classic Rock · South Florida</p>
      </td></tr>
      <tr><td style="padding:40px;">
        <h1 style="margin:0 0 8px;font-size:28px;color:#111111;">You're confirmed! 🎸</h1>
        <p style="margin:0 0 24px;font-size:13px;color:#888888;text-transform:uppercase;letter-spacing:1px;">Rebound Rock Band · {{eventDate}}</p>
        <p style="margin:0 0 16px;font-size:15px;line-height:1.6;color:#444444;">Hi {{clientName}},</p>
        <p style="margin:0 0 16px;font-size:15px;line-height:1.6;color:#444444;">We're officially confirmed and couldn't be more excited to be part of your event on <strong>{{eventDate}}</strong>. Get ready for a night of classic rock that your guests will be talking about for a long time.</p>
        <p style="margin:0 0 16px;font-size:15px;line-height:1.6;color:#444444;">Here's what to expect from us leading up to the show:</p>
        <ul style="margin:0 0 16px;padding-left:20px;font-size:15px;line-height:1.8;color:#444444;">
          <li>We'll reach out a few days before to confirm load-in time and logistics</li>
          <li>Our standard setup requires about 90 minutes before showtime</li>
          <li>We bring our own PA and lighting — no additional equipment needed from your end</li>
        </ul>
        <p style="margin:0 0 32px;font-size:15px;line-height:1.6;color:#444444;">If you have any questions or song requests in the meantime, don't hesitate to reach out at <a href="mailto:{{replyEmail}}" style="color:#e0101e;">{{replyEmail}}</a>.</p>
        <p style="margin:0;font-size:15px;color:#444444;">See you on the stage!<br><strong>Rebound Rock Band</strong></p>
      </td></tr>
      <tr><td style="background:#f9f9f9;padding:20px 40px;border-top:1px solid #eeeeee;">
        <p style="margin:0;font-size:12px;color:#999999;">Rebound Rock Band · <a href="https://reboundrockband.com" style="color:#999999;">reboundrockband.com</a> · South Florida</p>
      </td></tr>
    </table>
  </td></tr>
</table>
</body>
</html>`,
  },
  {
    id: makeId(),
    slug: 'song-request-reply',
    name: 'Song Request Reply',
    isSystem: true,
    createdAt: now(),
    updatedAt: now(),
    subject: 'We got your song request, {{clientName}}!',
    bodyHtml: `<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;background:#f4f4f4;font-family:Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0">
  <tr><td align="center" style="padding:40px 16px;">
    <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;max-width:600px;width:100%;">
      <tr><td style="background:#e0101e;padding:24px 40px;">
        <p style="margin:0;color:#ffffff;font-size:22px;font-weight:700;letter-spacing:2px;text-transform:uppercase;">REBOUND ROCK BAND</p>
        <p style="margin:4px 0 0;color:rgba(255,255,255,0.7);font-size:11px;letter-spacing:1px;text-transform:uppercase;">Classic Rock · South Florida</p>
      </td></tr>
      <tr><td style="padding:40px;">
        <p style="margin:0 0 16px;font-size:15px;line-height:1.6;color:#444444;">Hey {{clientName}},</p>
        <p style="margin:0 0 16px;font-size:15px;line-height:1.6;color:#444444;">Thank you so much for your song request! It means a lot to us that you took the time to reach out — fans like you are the reason we keep rocking.</p>
        <p style="margin:0 0 16px;font-size:15px;line-height:1.6;color:#444444;">We've received your request for <strong>{{songList}}</strong> and we'll be reviewing it as we plan upcoming setlists. We're always looking to add great songs that our crowd loves.</p>
        <p style="margin:0 0 32px;font-size:15px;line-height:1.6;color:#444444;">Stay tuned to our upcoming shows and give us a follow — you might just hear your song live soon! Check out our schedule at <a href="https://reboundrockband.com" style="color:#e0101e;">reboundrockband.com</a>.</p>
        <p style="margin:0 0 4px;font-size:15px;color:#444444;">Rock on,<br><strong>Rebound Rock Band</strong></p>
        <p style="margin:16px 0 0;font-size:13px;color:#888888;">P.S. — Grab our merch at <a href="https://reboundrockband.com/merch" style="color:#e0101e;">reboundrockband.com/merch</a> and represent the band!</p>
      </td></tr>
      <tr><td style="background:#f9f9f9;padding:20px 40px;border-top:1px solid #eeeeee;">
        <p style="margin:0;font-size:12px;color:#999999;">Rebound Rock Band · <a href="https://reboundrockband.com" style="color:#999999;">reboundrockband.com</a> · South Florida</p>
      </td></tr>
    </table>
  </td></tr>
</table>
</body>
</html>`,
  },
  {
    id: makeId(),
    slug: 'venue-first-outreach',
    name: 'Venue First Outreach',
    isSystem: true,
    createdAt: now(),
    updatedAt: now(),
    subject: 'Live Rock Band Available — {{venueName}}',
    bodyHtml: `<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;background:#f4f4f4;font-family:Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0">
  <tr><td align="center" style="padding:40px 16px;">
    <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;max-width:600px;width:100%;">
      <tr><td style="background:#e0101e;padding:24px 40px;">
        <p style="margin:0;color:#ffffff;font-size:22px;font-weight:700;letter-spacing:2px;text-transform:uppercase;">REBOUND ROCK BAND</p>
        <p style="margin:4px 0 0;color:rgba(255,255,255,0.7);font-size:11px;letter-spacing:1px;text-transform:uppercase;">Classic Rock · {{serviceArea}}</p>
      </td></tr>
      <tr><td style="padding:40px;">
        <p style="margin:0 0 16px;font-size:15px;line-height:1.6;color:#444444;">Hi {{venueName}} team,</p>
        <p style="margin:0 0 16px;font-size:15px;line-height:1.6;color:#444444;">My name is Pepe, and I'm the band director of <strong>Rebound Rock Band</strong> — a five-piece live classic rock cover band based in {{serviceArea}}.</p>
        <p style="margin:0 0 16px;font-size:15px;line-height:1.6;color:#444444;">We play the greatest hits from the 1950s through the 1990s — Chuck Berry, The Beatles, Led Zeppelin, Queen, Bon Jovi, and everything in between. No backing tracks. Five real musicians, big sound, crowd-friendly energy.</p>
        <p style="margin:0 0 16px;font-size:15px;line-height:1.6;color:#444444;">We're actively looking for venue partners for regular bookings — bars, restaurants, festival stages, and private events. We bring our own PA and lighting and are easy to work with.</p>
        <p style="margin:0 0 24px;font-size:15px;line-height:1.6;color:#444444;">Would {{venueName}} be open to discussing live music bookings? I'd love to send over our full press kit and available dates.</p>
        <table cellpadding="0" cellspacing="0"><tr><td style="background:#e0101e;padding:12px 24px;"><a href="mailto:{{contactEmail}}" style="color:#ffffff;font-size:14px;font-weight:700;text-decoration:none;text-transform:uppercase;letter-spacing:1px;">Reply to This Email</a></td></tr></table>
        <p style="margin:32px 0 0;font-size:15px;color:#444444;">Thanks for your time,<br><strong>Jose "Pepe" Ortiz</strong><br>Band Director · {{bandName}}<br><a href="mailto:{{contactEmail}}" style="color:#e0101e;">{{contactEmail}}</a></p>
      </td></tr>
      <tr><td style="background:#f9f9f9;padding:20px 40px;border-top:1px solid #eeeeee;">
        <p style="margin:0;font-size:12px;color:#999999;">Rebound Rock Band · reboundrockband.com · {{serviceArea}}<br>To opt out of future outreach, simply reply with "remove."</p>
      </td></tr>
    </table>
  </td></tr>
</table>
</body>
</html>`,
  },
  {
    id: makeId(),
    slug: 'venue-follow-up',
    name: 'Venue Follow-Up',
    isSystem: true,
    createdAt: now(),
    updatedAt: now(),
    subject: 'Following Up — Rebound Rock Band at {{venueName}}',
    bodyHtml: `<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;background:#f4f4f4;font-family:Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0">
  <tr><td align="center" style="padding:40px 16px;">
    <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;max-width:600px;width:100%;">
      <tr><td style="background:#e0101e;padding:24px 40px;">
        <p style="margin:0;color:#ffffff;font-size:22px;font-weight:700;letter-spacing:2px;text-transform:uppercase;">REBOUND ROCK BAND</p>
        <p style="margin:4px 0 0;color:rgba(255,255,255,0.7);font-size:11px;letter-spacing:1px;text-transform:uppercase;">Classic Rock · South Florida</p>
      </td></tr>
      <tr><td style="padding:40px;">
        <p style="margin:0 0 16px;font-size:15px;line-height:1.6;color:#444444;">Hi {{venueName}} team,</p>
        <p style="margin:0 0 16px;font-size:15px;line-height:1.6;color:#444444;">I reached out recently about bringing <strong>{{bandName}}</strong> to your venue for live music. I wanted to follow up in case my previous message got lost in the shuffle.</p>
        <p style="margin:0 0 16px;font-size:15px;line-height:1.6;color:#444444;">We're a five-piece classic rock cover band playing everything from Chuck Berry to Bon Jovi — the kind of music that gets people out of their seats and ordering another round.</p>
        <p style="margin:0 0 24px;font-size:15px;line-height:1.6;color:#444444;">Do you have any upcoming dates that might be a good fit for live music? I'd love to find a time that works for both of us.</p>
        <table cellpadding="0" cellspacing="0"><tr><td style="background:#e0101e;padding:12px 24px;"><a href="mailto:{{contactEmail}}" style="color:#ffffff;font-size:14px;font-weight:700;text-decoration:none;text-transform:uppercase;letter-spacing:1px;">Reply to This Email</a></td></tr></table>
        <p style="margin:32px 0 0;font-size:15px;color:#444444;">Thanks again,<br><strong>Jose "Pepe" Ortiz</strong><br>Band Director · {{bandName}}<br><a href="mailto:{{contactEmail}}" style="color:#e0101e;">{{contactEmail}}</a></p>
      </td></tr>
      <tr><td style="background:#f9f9f9;padding:20px 40px;border-top:1px solid #eeeeee;">
        <p style="margin:0;font-size:12px;color:#999999;">Rebound Rock Band · reboundrockband.com<br>To opt out of future outreach, simply reply with "remove."</p>
      </td></tr>
    </table>
  </td></tr>
</table>
</body>
</html>`,
  },
  {
    id: makeId(),
    slug: 'venue-thanks-booked',
    name: 'Thanks & Booked Confirmation',
    isSystem: true,
    createdAt: now(),
    updatedAt: now(),
    subject: 'Confirmed — Rebound Rock Band at {{venueName}} on {{eventDate}}',
    bodyHtml: `<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;background:#f4f4f4;font-family:Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0">
  <tr><td align="center" style="padding:40px 16px;">
    <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;max-width:600px;width:100%;">
      <tr><td style="background:#e0101e;padding:24px 40px;">
        <p style="margin:0;color:#ffffff;font-size:22px;font-weight:700;letter-spacing:2px;text-transform:uppercase;">REBOUND ROCK BAND</p>
        <p style="margin:4px 0 0;color:rgba(255,255,255,0.7);font-size:11px;letter-spacing:1px;text-transform:uppercase;">Classic Rock · South Florida</p>
      </td></tr>
      <tr><td style="padding:40px;">
        <h1 style="margin:0 0 16px;font-size:24px;color:#111111;">We're confirmed!</h1>
        <p style="margin:0 0 16px;font-size:15px;line-height:1.6;color:#444444;">We're thrilled to be confirmed at <strong>{{venueName}}</strong> on <strong>{{eventDate}}</strong>. The crowd is going to love it.</p>
        <p style="margin:0 0 16px;font-size:15px;line-height:1.6;color:#444444;">We'll be in touch closer to the show date to coordinate load-in time, stage access, and any other logistics. Our standard setup takes about 90 minutes and we're always easy to work with.</p>
        <p style="margin:0 0 24px;font-size:15px;line-height:1.6;color:#444444;">If anything comes up before then, feel free to reach out directly at <a href="mailto:{{contactEmail}}" style="color:#e0101e;">{{contactEmail}}</a>.</p>
        <p style="margin:0;font-size:15px;color:#444444;">See you on stage,<br><strong>{{bandName}}</strong></p>
      </td></tr>
      <tr><td style="background:#f9f9f9;padding:20px 40px;border-top:1px solid #eeeeee;">
        <p style="margin:0;font-size:12px;color:#999999;">Rebound Rock Band · reboundrockband.com · booking@reboundrockband.com</p>
      </td></tr>
    </table>
  </td></tr>
</table>
</body>
</html>`,
  },
]

// Sync: add any missing default templates by slug (migration-safe)
function syncDefaultTemplates(existing: EmailTemplate[]): { templates: EmailTemplate[]; changed: boolean } {
  const existingSlugs = new Set(existing.map((t) => t.slug))
  const missing = DEFAULT_TEMPLATES.filter((t) => !existingSlugs.has(t.slug))
  if (missing.length === 0) return { templates: existing, changed: false }
  return { templates: [...existing, ...missing], changed: true }
}

// ── Local filesystem (dev) ─────────────────────────────────────────────────────

function readLocal(): VenueStore {
  try {
    const dir = path.dirname(VENUE_DATA_PATH)
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
    if (!fs.existsSync(VENUE_DATA_PATH)) {
      const seed: VenueStore = {
        venues: [],
        outreachLogs: [],
        emailTemplates: DEFAULT_TEMPLATES,
        autoReplyLogs: [],
        bookingEmailLogs: [],
        inboundEmails: [],
      }
      fs.writeFileSync(VENUE_DATA_PATH, JSON.stringify(seed, null, 2))
      return seed
    }
    const raw = fs.readFileSync(VENUE_DATA_PATH, 'utf-8')
    const parsed = JSON.parse(raw) as Partial<VenueStore>
    let templates: EmailTemplate[] = parsed.emailTemplates ?? []
    let changed = false

    if (templates.length === 0) {
      templates = DEFAULT_TEMPLATES
      changed = true
    } else {
      const sync = syncDefaultTemplates(templates)
      if (sync.changed) { templates = sync.templates; changed = true }
    }

    const store: VenueStore = {
      venues: parsed.venues ?? [],
      outreachLogs: parsed.outreachLogs ?? [],
      emailTemplates: templates,
      autoReplyLogs: parsed.autoReplyLogs ?? [],
      bookingEmailLogs: parsed.bookingEmailLogs ?? [],
      inboundEmails: parsed.inboundEmails ?? [],
    }
    if (changed) fs.writeFileSync(VENUE_DATA_PATH, JSON.stringify(store, null, 2))
    return store
  } catch {
    return {
      venues: [],
      outreachLogs: [],
      emailTemplates: DEFAULT_TEMPLATES,
      autoReplyLogs: [],
      bookingEmailLogs: [],
      inboundEmails: [],
    }
  }
}

function writeLocal(updates: Partial<VenueStore>): VenueStore {
  const current = readLocal()
  const merged = { ...current, ...updates }
  fs.writeFileSync(VENUE_DATA_PATH, JSON.stringify(merged, null, 2))
  return merged
}

// ── Vercel KV (prod) ──────────────────────────────────────────────────────────

async function readKV(): Promise<VenueStore> {
  const { kv } = await import('@vercel/kv')
  const [venues, outreachLogs, emailTemplates, autoReplyLogs, bookingEmailLogs, inboundEmails] = await Promise.all([
    kv.get<Venue[]>(KV_KEYS.venues),
    kv.get<OutreachLog[]>(KV_KEYS.outreachLogs),
    kv.get<EmailTemplate[]>(KV_KEYS.emailTemplates),
    kv.get<AutoReplyLog[]>(KV_KEYS.autoReplyLogs),
    kv.get<BookingEmailLog[]>(KV_KEYS.bookingEmailLogs),
    kv.get<InboundEmail[]>(KV_KEYS.inboundEmails),
  ])
  let templates = emailTemplates ?? []
  if (templates.length === 0) {
    templates = DEFAULT_TEMPLATES
    await kv.set(KV_KEYS.emailTemplates, templates)
  } else {
    const sync = syncDefaultTemplates(templates)
    if (sync.changed) {
      templates = sync.templates
      await kv.set(KV_KEYS.emailTemplates, templates)
    }
  }
  return {
    venues: venues ?? [],
    outreachLogs: outreachLogs ?? [],
    emailTemplates: templates,
    autoReplyLogs: autoReplyLogs ?? [],
    bookingEmailLogs: bookingEmailLogs ?? [],
    inboundEmails: inboundEmails ?? [],
  }
}

async function writeKV(updates: Partial<VenueStore>): Promise<VenueStore> {
  const { kv } = await import('@vercel/kv')
  const current = await readKV()
  const merged = { ...current, ...updates }
  const writes = Object.entries(updates).map(([key, value]) => kv.set(key, value))
  await Promise.all(writes)
  return merged
}

// ── Public API ─────────────────────────────────────────────────────────────────

export async function readVenueStore(): Promise<VenueStore> {
  return useKV ? readKV() : Promise.resolve(readLocal())
}

// ── Venues ────────────────────────────────────────────────────────────────────

export async function getVenues(): Promise<Venue[]> {
  const store = await readVenueStore()
  return store.venues.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
}

export async function addVenue(venue: Omit<Venue, 'id' | 'createdAt' | 'updatedAt'>): Promise<Venue> {
  const store = await readVenueStore()
  const newVenue: Venue = {
    ...venue,
    id: crypto.randomBytes(8).toString('hex'),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
  const venues = [...store.venues, newVenue]
  useKV ? await writeKV({ venues }) : writeLocal({ venues })
  return newVenue
}

export async function updateVenue(id: string, patch: Partial<Venue>): Promise<Venue> {
  const store = await readVenueStore()
  const idx = store.venues.findIndex((v) => v.id === id)
  if (idx === -1) throw new Error(`Venue ${id} not found`)
  const updated: Venue = { ...store.venues[idx], ...patch, updatedAt: new Date().toISOString() }
  const venues = store.venues.map((v) => (v.id === id ? updated : v))
  useKV ? await writeKV({ venues }) : writeLocal({ venues })
  return updated
}

export async function deleteVenue(id: string): Promise<void> {
  const store = await readVenueStore()
  const venues = store.venues.filter((v) => v.id !== id)
  useKV ? await writeKV({ venues }) : writeLocal({ venues })
}

// ── Email Templates ───────────────────────────────────────────────────────────

export async function getTemplates(): Promise<EmailTemplate[]> {
  const store = await readVenueStore()
  return store.emailTemplates
}

export async function getTemplateBySlug(slug: string): Promise<EmailTemplate | undefined> {
  const store = await readVenueStore()
  return store.emailTemplates.find((t) => t.slug === slug)
}

export async function updateTemplate(
  id: string,
  patch: Partial<Pick<EmailTemplate, 'name' | 'subject' | 'bodyHtml'>>
): Promise<EmailTemplate> {
  const store = await readVenueStore()
  const idx = store.emailTemplates.findIndex((t) => t.id === id)
  if (idx === -1) throw new Error(`Template ${id} not found`)
  const updated: EmailTemplate = { ...store.emailTemplates[idx], ...patch, updatedAt: new Date().toISOString() }
  const emailTemplates = store.emailTemplates.map((t) => (t.id === id ? updated : t))
  useKV ? await writeKV({ emailTemplates }) : writeLocal({ emailTemplates })
  return updated
}

// ── Venue Outreach Logs ───────────────────────────────────────────────────────

export async function addOutreachLog(log: Omit<OutreachLog, 'id'>): Promise<OutreachLog> {
  const store = await readVenueStore()
  const newLog: OutreachLog = { ...log, id: crypto.randomBytes(8).toString('hex') }
  const outreachLogs = [...store.outreachLogs, newLog]
  useKV ? await writeKV({ outreachLogs }) : writeLocal({ outreachLogs })
  return newLog
}

export async function getOutreachLogsForVenue(venueId: string): Promise<OutreachLog[]> {
  const store = await readVenueStore()
  return store.outreachLogs
    .filter((l) => l.venueId === venueId)
    .sort((a, b) => b.sentAt.localeCompare(a.sentAt))
}

// ── Auto-Reply Logs ───────────────────────────────────────────────────────────

export async function getAutoReplyLogForBooking(bookingId: string): Promise<AutoReplyLog | undefined> {
  const store = await readVenueStore()
  return store.autoReplyLogs.find((l) => l.bookingId === bookingId)
}

export async function addAutoReplyLog(log: Omit<AutoReplyLog, 'id'>): Promise<AutoReplyLog> {
  const store = await readVenueStore()
  const newLog: AutoReplyLog = { ...log, id: crypto.randomBytes(8).toString('hex') }
  const autoReplyLogs = [...store.autoReplyLogs, newLog]
  useKV ? await writeKV({ autoReplyLogs }) : writeLocal({ autoReplyLogs })
  return newLog
}

export async function updateAutoReplyLog(id: string, patch: Partial<AutoReplyLog>): Promise<AutoReplyLog> {
  const store = await readVenueStore()
  const idx = store.autoReplyLogs.findIndex((l) => l.id === id)
  if (idx === -1) throw new Error(`AutoReplyLog ${id} not found`)
  const updated: AutoReplyLog = { ...store.autoReplyLogs[idx], ...patch }
  const autoReplyLogs = store.autoReplyLogs.map((l) => (l.id === id ? updated : l))
  useKV ? await writeKV({ autoReplyLogs }) : writeLocal({ autoReplyLogs })
  return updated
}

// ── Booking / Song-Request Email Logs ─────────────────────────────────────────

export async function addBookingEmailLog(log: Omit<BookingEmailLog, 'id'>): Promise<BookingEmailLog> {
  const store = await readVenueStore()
  const newLog: BookingEmailLog = { ...log, id: crypto.randomBytes(8).toString('hex') }
  const bookingEmailLogs = [...(store.bookingEmailLogs ?? []), newLog]
  useKV ? await writeKV({ bookingEmailLogs }) : writeLocal({ bookingEmailLogs })
  return newLog
}

export async function getBookingEmailLogs(entityType: 'booking' | 'song-request', entityId: string): Promise<BookingEmailLog[]> {
  const store = await readVenueStore()
  return (store.bookingEmailLogs ?? [])
    .filter((l) => l.entityType === entityType && l.entityId === entityId)
    .sort((a, b) => b.sentAt.localeCompare(a.sentAt))
}

// ── Inbound Emails ────────────────────────────────────────────────────────────

export async function addInboundEmail(email: Omit<InboundEmail, 'id'>): Promise<InboundEmail> {
  const store = await readVenueStore()
  const newEmail: InboundEmail = { ...email, id: crypto.randomBytes(8).toString('hex') }
  const inboundEmails = [...(store.inboundEmails ?? []), newEmail]
  useKV ? await writeKV({ inboundEmails }) : writeLocal({ inboundEmails })
  return newEmail
}

export async function getInboundEmails(): Promise<InboundEmail[]> {
  const store = await readVenueStore()
  return (store.inboundEmails ?? []).sort((a, b) => b.receivedAt.localeCompare(a.receivedAt))
}

export async function getInboundEmailsForEntity(
  entityType: InboundEmail['entityType'],
  entityId: string
): Promise<InboundEmail[]> {
  const store = await readVenueStore()
  return (store.inboundEmails ?? [])
    .filter((e) => e.entityType === entityType && e.entityId === entityId)
    .sort((a, b) => b.receivedAt.localeCompare(a.receivedAt))
}

export async function markInboundEmailRead(id: string): Promise<void> {
  const store = await readVenueStore()
  const inboundEmails = (store.inboundEmails ?? []).map((e) =>
    e.id === id ? { ...e, read: true } : e
  )
  useKV ? await writeKV({ inboundEmails }) : writeLocal({ inboundEmails })
}
