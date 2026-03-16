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

**Design Principles:**
- Swappable layers (DB/AI providers)
- Reusable service layer
- Type-safe validation
- Stateless API endpoints

---

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Set up environment variables
cp .env.example .env
# Edit .env with your database and API keys

# 3. Sync database schema
npm run db:push

# 4. Start development server
npm run dev
```

Visit `http://localhost:3000`

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

Create a `.env` file:

```env
DATABASE_URL=postgresql://user:password@host/dbname
GROQ_API_KEY=your_groq_api_key
GROQ_MODEL=llama-3.1-8b-instant
```

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
