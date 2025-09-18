# Jobbcentralen (Vue/Nuxt)

A modern Swedish job search application that fetches jobs from Platsbanken API. Built with Nuxt 3, Vue 3, TypeScript, and Tailwind CSS with Försäkringskassan-inspired design.

## ✨ Features

- **Platsbanken Integration**: Direct integration with Sweden's official job portal API
- **Smart Job Search**: Search jobs by keywords, location, and profession
- **Advanced Filtering**: Filter by location (municipality/region), profession, employment type, and experience level
- **Mobile-First Design**: Responsive design inspired by Försäkringskassan's clean, accessible interface
- **Real-time Search**: Live job search with pagination and load-more functionality
- **Professional Styling**: Uses Sweden's government design system color palette (#116A3E)
- **Accessibility**: WCAG compliant with proper focus management and screen reader support

## 🛠 Tech Stack

### Frontend
- **Nuxt 3** - Full-stack Vue framework with SSR
- **Vue 3** - Progressive JavaScript framework
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Nuxt UI** - Ready-made Vue components
- **Pinia** - State management via `@pinia/nuxt`
- **VueUse** - Collection of Vue composition utilities

### Backend & Services
- **Platsbanken API** - Sweden's official job portal API integration
- **Nitro** - Nuxt's server engine for API routes and data fetching

### Additional Libraries
- **@nuxtjs/tailwindcss** - Tailwind CSS integration
- **TypeScript** - Full type safety for Platsbanken API responses

## 🚀 Quick Start

### Prerequisites

- Node.js 20+
- pnpm (recommended) or npm
- Git

### 1. Clone and Install

```bash
pnpm install
```

### 2. Development Server

```bash
pnpm dev
```

Visit `http://localhost:3000` to see your application running.

The application will start fetching jobs from Platsbanken API automatically. No additional configuration needed!

## 🔧 API Integration

The application integrates with the official Platsbanken API (JobTech Dev):

### Available Endpoints

- **Job Search**: `GET /api/jobs/platsbanken` - Search and filter jobs
- **Filter Concepts**: `GET /api/jobs/concepts` - Get locations and professions for filters

### Platsbanken API Features

- Free text search across job titles, companies, and descriptions
- Location filtering by municipality and region
- Profession filtering by occupation and occupation groups
- Employment type filtering (permanent, temporary)
- Experience level filtering
- Real-time data from Sweden's official job portal

## 📁 Project Structure

```
jobsite-vue/
├── server/
│   ├── api/
│   │   ├── healthz.get.ts           # Health check endpoint
│   │   └── jobs/
│   │       ├── platsbanken.get.ts   # Platsbanken API integration
│   │       └── concepts.get.ts      # Location/profession concepts
│   └── middleware/
│       └── securityHeaders.ts       # Security headers
├── app/
│   ├── app.vue                      # Root application component
│   └── pages/
│       └── index.vue                # Main job search page
├── components/
│   ├── JobSearchForm.vue            # Search form component
│   ├── JobFilters.vue               # Filter sidebar component
│   ├── JobCard.vue                  # Individual job card
│   └── JobCardSkeleton.vue          # Loading skeleton
├── types/
│   └── platsbanken.ts               # TypeScript types for API
├── tailwind.config.ts               # Tailwind configuration
├── nuxt.config.ts                   # Nuxt configuration
└── package.json                     # Dependencies
```

## 🔧 API Endpoints

### Public Endpoints
- `GET /api/healthz` - Health check
- `GET /api/jobs/platsbanken` - Search and filter jobs from Platsbanken
- `GET /api/jobs/concepts` - Get filter concepts (locations, professions)

## 🎨 Design System

The application follows Försäkringskassan's design principles:

- **Primary Color**: #116A3E (Swedish government green)
- **Typography**: Inter font family for accessibility
- **Layout**: Clean, spacious design with clear hierarchy
- **Accessibility**: WCAG 2.1 AA compliant
- **Mobile-first**: Responsive design for all devices

## 🚀 Deployment

### Build Commands

```bash
# Build for production
pnpm build

# Preview production build
pnpm preview

# Generate static site (if needed)
pnpm generate
```

### Production Notes

- No environment variables required - the app uses public APIs
- Works with any hosting provider (Vercel, Netlify, etc.)
- Built-in security headers for production deployment
