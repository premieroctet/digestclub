<div align="center" style="display:flex;flex-direction:column;">
  <a href="https://digest.club">
    <img wid src="./public/hero.svg" width="500px" alt="Digest.club: The frontpage of teams knowledge" />
  </a>
</div>

## Digest.club

### The frontpage of teams knowledge

Unlock the power of streamlined knowledge management with Digest Club, the solution for teams looking to centralize their information gathering, sharing, and curation. Say goodbye to scattered bookmarks, disjointed Slack conversations, and missed opportunities to showcase your expertise.

👉 [https://digest.club](https://digest.club)

## Features

- 📚 Bookmarking: Easily add and organize links via our website.
- 🔗 Slack Integration: Automatically import links posted in Slack channels.
- 📅 Periodic Digests: Create curated digests at scheduled intervals.
- 💌 Newsletter Sharing: Share digests in a polished newsletter format.
- 🐦 Twitter Threads: Transform digests into engaging Twitter threads.
- ✨ Markdown Enrichment: Enhance digests with markdown-enhanced content.

## Stack

- ▲ [Next.js](https://nextjs.org/) for webapp (app dir + TS)
- 🖼 [Tailwind](https://tailwindcss.com/) for UI components
- 📦 [Prisma](https://www.prisma.io/) for database

## Getting Started

Install dependencies:

```bash
pipenv install
pipenv shell
yarn install
```

You can use Docker to run a local postgres database and maildev server (accessible at http://localhost:1080):

```bash
docker-compose up -d
```

Create .env:

```bash
cp .env.example .env
```

Run migrations

```bash
yarn prisma:migrate:dev
```

Run seeders

```bash
yarn prisma:seed
```

Run the development server:

```bash
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
