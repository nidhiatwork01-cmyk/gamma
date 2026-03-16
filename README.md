# Second Brain (Full-Stack Assignment Build)

Production-style implementation of the internship assignment:

- Full-stack app with capture + dashboard + detail views
- PostgreSQL persistence through Prisma
- AI enrichment (summary + auto-tags) on ingestion
- Public query endpoint: `GET /api/public/brain/query`
- Documentation page: `/docs`

## 1) Stack

- Next.js 16 (App Router), React 19, Tailwind v4
- Prisma ORM + PostgreSQL
- Zod validation on API boundaries
- Server-side AI calls via Groq

## 2) Data Model

`KnowledgeItem` fields:

- `id`, `title`, `content`
- `type` (`NOTE | LINK | INSIGHT`)
- `sourceUrl` (optional)
- `tags` (`string[]`)
- `summary` (AI-generated or fallback)
- `createdAt`, `updatedAt`

## 3) API

- `GET /api/knowledge`
  - Query params: `q`, `type`, `tag`, `sort`
- `POST /api/knowledge`
  - Payload: `{ title, content, type, sourceUrl?, tagsInput? }`
- `GET /api/knowledge/:id`
- `GET /api/public/brain/query?question=...`
  - Returns `{ question, answer, sources[] }`

## 4) Architecture Notes

- `src/lib/knowledge-service.ts`: core domain logic (create/list/query ranking)
- `src/lib/ai.ts`: AI summarization/tagging and query synthesis with deterministic fallback
- `src/lib/knowledge-schema.ts`: input validation + tag parsing
- `src/app/api/*`: HTTP interface layer
- `src/app/*`: app screens

This keeps layers swappable:

- Replace DB provider without changing UI/API contract
- Replace AI provider by editing one adapter (`src/lib/ai.ts`)
- Reuse public endpoint for external widgets/clients

## 5) Features

- Knowledge capture via dashboard form
- Smart dashboard with search/filter/sort
- Detail page for individual items
- AI summarization & auto-tagging
- Conversational query endpoint
- Public API for external widgets
- Documentation page at `/docs`

## 6) Commands

```bash
npm install
npm run dev          # Start dev server
npm run build        # Production build
npm run lint         # Lint code
npm run db:generate  # Generate Prisma client
npm run db:push      # Push schema to database
npm run db:studio    # Open Prisma Studio
```
