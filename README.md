# Rebound Rock Band

Website and booking back office for Rebound Rock Band, a South Florida classic rock cover
band — [reboundrockband.com](https://reboundrockband.com).

**Stack:** Next.js 16, React 19, TypeScript, Tailwind, Vercel KV

---

## What it does

| Route | Purpose |
|---|---|
| `/` , `/about` | The band, for people deciding whether to book them |
| `/shows` | Upcoming and past dates |
| `/media` | Photos and video |
| `/epk` | Press kit a venue can act on: bio, lineup, tech needs |
| `/merch` | Store front |
| `/booking` | Venue and event enquiries |
| `/admin` | Content, shows, media and booking management |

API routes cover bookings, site content, song requests, media upload and admin sign-in.

---

## Notes

The site is written for two audiences at once. A fan wants shows and media; a venue wants the
EPK and a way to enquire without a phone call. Those needs pull the layout in opposite
directions, so booking and press material stay one click from anywhere rather than buried
under a menu.

Song requests and media uploads are handled server-side rather than through a third-party
form, which keeps the band's contact details off the page and the submissions in one place
the band can actually work through.

Content is editable from `/admin`, so shows and media are updated by the band without a
deploy.

---

## Running it

```bash
npm install
npm run dev
```

Environment variables are not committed; the app expects Vercel KV credentials from the
deployment environment.

---

## License

None. Published as a portfolio piece: the source is here to be read, not reused.
All rights reserved.
