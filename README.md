# ReadLater

**Curate Your Curiosity** — A calm place to save links you want to read later.

🔗 **Live:** [readlaterhq.vercel.app](https://readlaterhq.vercel.app)

## Features

- **Save links instantly** — No sign-up required, works immediately
- **Cross-device sync** — Sign in with Google to access your links anywhere
- **Organize by status** — To Read, In Progress, Finished
- **Search your library** — Find links by title or URL
- **Grid or List view** — Choose how you browse
- **Auto-fetch titles** — Saves the page title automatically when you don't enter one
- **Mobile-first** — Designed for the 75% of users on mobile

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 16 |
| Database | Neon Postgres (Serverless) |
| ORM | Prisma |
| Auth | NextAuth.js + Google OAuth |
| Hosting | Vercel |
| Styling | Tailwind CSS |

## How It Works

- **Anonymous users:** Links are saved using a browser cookie (ownerKey). No account needed.
- **Signed-in users:** Links are tied to your Google account and sync across devices.

## Development
```bash
# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env.local
# Add your DATABASE_URL, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, NEXTAUTH_SECRET

# Push database schema
npx prisma db push

# Run locally
pnpm dev
```

## Author

Built with ❤️ [Nidhi Wadmark](https://linkedin.com/in/nidhiwadmark)

## License

MIT
```
