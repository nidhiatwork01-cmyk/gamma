# Second Brain

### Production-Style Full-Stack Knowledge Management System

![Node.js](https://img.shields.io/badge/Node.js-20+-43853D?style=for-the-badge&logo=node.js)
![Next.js](https://img.shields.io/badge/Next.js-16-000000?style=for-the-badge&logo=next.js)
![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-336791?style=for-the-badge&logo=postgresql)
![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?style=for-the-badge&logo=prisma)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-06B6D4?style=for-the-badge&logo=tailwindcss)

---

## 🚀 Live Demo

**[Try it now](https://gamma-wheat-eight.vercel.app/)** → https://gamma-wheat-eight.vercel.app/

---

## About

A comprehensive **knowledge management system** with AI-powered enrichment. Capture, organize, and query your knowledge with semantic search and intelligent tagging.

### Key Features
- **Knowledge Capture** - Dashboard form for adding notes, links, and insights
- **Smart Dashboard** - Search, filter, sort with full-text query support
- **AI Enrichment** - Automatic summarization and intelligent tagging
- **Public API** - Shareable query endpoint for external widgets
- **Documentation** - Built-in docs page at `/docs`

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | Next.js 16, React 19, Tailwind v4 |
| **Backend** | Next.js API Routes, Node.js |
| **Database** | PostgreSQL, Prisma ORM |
| **Validation** | Zod (input boundaries) |
| **AI** | Groq (LLM for summaries & tags) |
| **Deployment** | Vercel |

---

## Data Model

Each `KnowledgeItem` contains:

```typescript
{
  id: string              // Unique identifier
  title: string           // Item title
  content: string         // Full content
  type: "NOTE" | "LINK" | "INSIGHT"
  sourceUrl?: string      // Optional source URL
  tags: string[]          // Auto-generated tags
  summary: string         // AI-generated or fallback
  createdAt: Date
  updatedAt: Date
}
```

---

## API Endpoints

### Knowledge Management
- `GET /api/knowledge` - List all items
  - Query: `q`, `type`, `tag`, `sort`
- `POST /api/knowledge` - Create new item
  - Body: `{ title, content, type, sourceUrl?, tagsInput? }`
- `GET /api/knowledge/:id` - Get specific item

### Public Interface
- `GET /api/public/brain/query?question=...` - Conversational query
  - Response: `{ question, answer, sources[] }`

---

## Architecture

```
src/
├── lib/
│   ├── knowledge-service.ts    # Domain logic (CRUD, ranking)
│   ├── ai.ts                   # AI adapters (summarization, tagging)
│   ├── knowledge-schema.ts      # Zod validation schemas
│   ├── knowledge-constants.ts   # Type definitions
│   └── prisma.ts               # Database client
├── app/
│   ├── api/                    # HTTP interface
│   │   ├── knowledge/
│   │   └── public/brain/query/
│   ├── knowledge/[id]/         # Detail page
│   ├── docs/                   # Documentation
│   └── page.tsx                # Dashboard (home)
└── components/                 # React components
    ├── knowledge-form.tsx
    ├── knowledge-list.tsx
    ├── dashboard-filters.tsx
    └── ...
```

---

## Architecture & Design

### Design Principles

**Portability**
- Service layer decoupled from UI/API
- Database provider agnostic (swap ORM, use MongoDB, etc.)
- AI provider configurable (Groq → OpenAI → Claude easily)
- Deterministic fallbacks (works without AI)

**UX Principles**
- Fast dashboard with client-side filtering
- Instant feedback (optimistic updates planned)
- Clear information hierarchy (list → detail → full content)
- Mobile-responsive design (Tailwind responsive classes)

**Infrastructure**
- Serverless-ready (runs on Vercel, Netlify, AWS Lambda)
- Edge-compatible (stateless API routes)
- Cold-start optimized (minimal dependencies)
- Database connection pooling (Neon/Supabase recommended)

### Agent Thinking Pattern

The system implements a "capture → enrich → query" loop:

1. **Capture Phase** - Form submission captures title, content, type, URL
2. **Enrichment Phase** - AI generates summary and auto-tags (or falls back)
3. **Storage Phase** - Prisma persists to PostgreSQL
4. **Query Phase** - Search/filter surfaces relevant items
5. **Response Phase** - Public API synthesizes answer from sources

This keeps the knowledge flow explicit and cacheable.

### Technology Rationale

| Technology | Why |
|-----------|-----|
| **Next.js 16** | Full-stack, API routes, fast builds |
| **React 19** | Modern hooks, better performance |
| **Prisma** | Type-safe DB access, migrations |
| **PostgreSQL** | Reliable, JSONB support for tags |
| **Zod** | Runtime validation on API boundaries |
| **Groq** | Fast LLM inference, free tier |
| **Tailwind** | Utility-first, responsive, performant |

---

## Quick Start

### Prerequisites
- Node.js 20+ ([nodejs.org](https://nodejs.org))
- PostgreSQL 14+ (Neon, Supabase, or local)
- npm/yarn/pnpm

### Local Setup (5 minutes)

```bash
# 1. Clone repository
git clone https://github.com/nidhiatwork01-cmyk/gamma.git
cd gamma

# 2. Install dependencies
npm install

# 3. Configure environment
cp .env.example .env
# Edit .env with your database and API keys

# 4. Sync database schema
npm run db:generate
npm run db:push

# 5. Start development server
npm run dev
```

Visit `http://localhost:3000` → Dashboard loads!

### Database Setup

**Option 1: Neon (Recommended - Free)**
1. Sign up at [neon.tech](https://neon.tech)
2. Create a project
3. Copy connection string → `DATABASE_URL` and `DIRECT_URL` in `.env`

**Option 2: Supabase**
1. Create project at [supabase.com](https://supabase.com)
2. Connection details in Project Settings → Database
3. Update `.env`

**Option 3: Local PostgreSQL**
```bash
# macOS (Homebrew)
brew install postgresql
brew services start postgresql

# Linux (Ubuntu)
sudo apt install postgresql postgresql-contrib
sudo service postgresql start

# Windows (Download from postgresql.org)
```

### First Run Checklist
- [ ] Database connection working (`npm run db:push` succeeds)
- [ ] GROQ API key set (or app works without it with fallback)
- [ ] Dev server running (`npm run dev`)
- [ ] Dashboard loads at localhost:3000
- [ ] Can create a knowledge item

---

## Available Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server (port 3000) |
| `npm run build` | Production build |
| `npm start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run db:generate` | Generate Prisma client |
| `npm run db:push` | Push schema to database |
| `npm run db:studio` | Open Prisma Studio GUI |

---

## Environment Variables

Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL=postgresql://user:password@host:port/dbname
DIRECT_URL=postgresql://user:password@host:port/dbname

# AI/LLM
GROQ_API_KEY=your_groq_api_key
GROQ_MODEL=llama-3.1-8b-instant
# GROQ_BASE_URL=https://api.groq.com/openai/v1  # Optional

# Environment
NODE_ENV=development
```

**For Local Development:**
- Use a local PostgreSQL instance or Neon's free tier
- Get `GROQ_API_KEY` from [console.groq.com](https://console.groq.com)

**For Production (Vercel):**
- Use Neon or Supabase for PostgreSQL
- Same environment variables apply

See `.env.example` for reference.

---

## Deployment

### Deploy to Vercel (Recommended)

1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com) → **Add New Project**
3. Import your repository
4. Add environment variables in **Settings** → **Environment Variables**:
   - `DATABASE_URL`
   - `GROQ_API_KEY`
   - `GROQ_MODEL`
5. Click **Deploy**

Your app is live!

---

## License

MIT - Feel free to use for personal or commercial projects

---

## Contributing

Bug reports and feature requests welcome! Open an issue or submit a pull request.
