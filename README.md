<div align="center">
  <img src="public/logo.svg" alt="NewTube Logo" width="120" height="120">
  
  # 🎬 NewTube
  
  ### A Modern, Full-Featured Video Sharing Platform
  
  [![Deployment Status](https://img.shields.io/badge/Deployment-Ready-success?style=for-the-badge&logo=vercel)](https://vercel.com)
  [![Build Status](https://img.shields.io/badge/Build-Passing-brightgreen?style=for-the-badge&logo=github-actions)](https://github.com/singhnikhil01/new-tube)
  [![License](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)](LICENSE)
  
  [![Next.js](https://img.shields.io/badge/Next.js-15.1.6-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
  [![React](https://img.shields.io/badge/React-19.0-61DAFB?style=for-the-badge&logo=react)](https://reactjs.org/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
  
  [Live Demo](https://new-tube.vercel.app) • [Report Bug](https://github.com/singhnikhil01/new-tube/issues) • [Request Feature](https://github.com/singhnikhil01/new-tube/issues)
</div>

---

## 📋 Table of Contents

- [About](#about)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
  - [Database Setup](#database-setup)
- [Usage](#usage)
- [Deployment](#deployment)
- [Architecture](#architecture)
- [API Documentation](#api-documentation)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

---

## 🎯 About

**NewTube** is a modern, feature-rich video sharing platform built with cutting-edge web technologies. Inspired by YouTube, it offers a seamless experience for content creators and viewers with advanced features like AI-powered content generation, real-time interactions, and professional video management.

### 🌟 Why NewTube?

- **🚀 High Performance**: Built on Next.js 15 with React 19 for lightning-fast performance
- **🎨 Modern UI**: Beautiful, responsive design powered by Tailwind CSS and Radix UI
- **🔒 Secure**: Enterprise-grade authentication with Clerk
- **⚡ Scalable**: Serverless architecture with Neon PostgreSQL and Upstash Redis
- **🤖 AI-Powered**: Intelligent content generation using Google Gemini AI
- **📱 Responsive**: Mobile-first design that works on all devices

---

## ✨ Features

### 🎥 Video Management
- **Upload & Streaming**: High-quality video upload with Mux streaming
- **AI Metadata Generation**: Automatic title, description, and thumbnail generation
- **Video Processing**: Adaptive bitrate streaming for optimal playback
- **Playlist Management**: Create and organize video playlists
- **Watch History**: Track viewing history with timestamps

### 👥 User Features
- **Authentication**: Secure sign-up/sign-in with Clerk
- **User Profiles**: Customizable profiles with banners and avatars
- **Subscriptions**: Follow your favorite creators
- **Notifications**: Real-time updates on new content

### 💬 Engagement
- **Comments**: Nested comment threads
- **Reactions**: Like/dislike for videos and comments
- **Real-time Updates**: Live engagement metrics
- **Search**: Powerful search with filters

### 🎨 Content Discovery
- **Trending Feed**: Discover popular content
- **Category Filtering**: Browse by categories
- **Personalized Recommendations**: AI-powered suggestions
- **Subscription Feed**: Latest from your subscriptions

### 🛠️ Creator Studio
- **Video Management**: Edit, delete, and organize your content
- **Analytics**: View detailed statistics (coming soon)
- **Monetization**: Revenue tracking (coming soon)
- **Workflow Automation**: Upstash Workflow integration

### 🔐 Security & Performance
- **Rate Limiting**: Protect against abuse with Upstash
- **Content Moderation**: AI-powered moderation tools
- **CDN Integration**: Fast content delivery worldwide
- **Error Handling**: Graceful error boundaries

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **UI Library**: [React 19](https://reactjs.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Components**: [Radix UI](https://www.radix-ui.com/)
- **State Management**: [TanStack Query](https://tanstack.com/query)
- **Forms**: [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/)
- **Video Player**: [Mux Player](https://www.mux.com/)

### Backend
- **API Layer**: [tRPC](https://trpc.io/)
- **Database**: [Neon PostgreSQL](https://neon.tech/) (Serverless)
- **ORM**: [Drizzle ORM](https://orm.drizzle.team/)
- **Authentication**: [Clerk](https://clerk.com/)
- **File Upload**: [UploadThing](https://uploadthing.com/)
- **Video Processing**: [Mux](https://www.mux.com/)
- **Caching**: [Upstash Redis](https://upstash.com/)
- **Rate Limiting**: [Upstash Ratelimit](https://upstash.com/docs/redis/features/ratelimiting)
- **Workflows**: [Upstash Workflow](https://upstash.com/docs/workflow)

### AI & Analytics
- **AI SDK**: [Google Gemini](https://ai.google.dev/)
- **Webhooks**: [Svix](https://www.svix.com/)

### Development Tools
- **Package Manager**: [Bun](https://bun.sh/) / npm
- **Linting**: [ESLint](https://eslint.org/)
- **Type Checking**: TypeScript

---

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher)
- **Bun** (recommended) or npm/yarn/pnpm
- **Git**
- A **PostgreSQL** database (or use [Neon](https://neon.tech/))
- Accounts for:
  - [Clerk](https://clerk.com/) (Authentication)
  - [Neon](https://neon.tech/) (Database)
  - [Mux](https://www.mux.com/) (Video streaming)
  - [UploadThing](https://uploadthing.com/) (File uploads)
  - [Upstash](https://upstash.com/) (Redis & Workflows)
  - [Google AI Studio](https://ai.google.dev/) (Optional, for AI features)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/singhnikhil01/new-tube.git
   cd new-tube
   ```

2. **Install dependencies**
   
   Using Bun (recommended):
   ```bash
   bun install
   ```
   
   Using npm:
   ```bash
   npm install --legacy-peer-deps
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the root directory (see [Environment Variables](#environment-variables) section below)

4. **Set up the database**
   ```bash
   # Generate database migrations
   bun run db:generate
   
   # Push schema to database
   bun run db:push
   
   # Seed initial data (categories)
   bun run db:seed
   ```

### Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL=/
NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL=/
CLERK_SIGNING_SECRET=your_clerk_webhook_secret

# Database (Neon PostgreSQL)
DATABASE_URL=postgresql://user:password@host/database?sslmode=require

# Upstash Redis
UPSTASH_REDIS_REST_URL=your_upstash_redis_url
UPSTASH_REDIS_REST_TOKEN=your_upstash_redis_token

# Mux Video
MUX_TOKEN_ID=your_mux_token_id
MUX_TOKEN_SECRET=your_mux_token_secret
MUX_WEBHOOK_SECRET=your_mux_webhook_secret

# UploadThing
UPLOADTHING_TOKEN=your_uploadthing_token

# Google Gemini AI (Optional)
GOOGLE_GENERATIVE_AI_API_KEY=your_google_ai_api_key

# Upstash Workflow (Optional)
QSTASH_TOKEN=your_qstash_token
QSTASH_CURRENT_SIGNING_KEY=your_qstash_signing_key
QSTASH_NEXT_SIGNING_KEY=your_qstash_next_signing_key
```

### Database Setup

The project uses Drizzle ORM with PostgreSQL. Available database commands:

```bash
# Generate migrations from schema
bun run db:generate

# Push schema to database (development)
bun run db:push

# Open Drizzle Studio (database GUI)
bun run db:studio

# Seed initial categories
bun run db:seed
```

---

## 💻 Usage

### Development

Start the development server:

```bash
# Standard development
bun run dev

# Development with webhooks (requires ngrok)
bun run dev:all
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

> **Note**: The `dev:all` command runs both the Next.js dev server and ngrok for webhook development. Update the ngrok URL in `package.json` if needed.

### Production Build

```bash
# Build for production
bun run build

# Start production server
bun run start
```

### Linting

```bash
# Run ESLint
bun run lint
```

---

## 🌐 Deployment

### Deploy to Vercel (Recommended)

NewTube is optimized for deployment on [Vercel](https://vercel.com):

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/singhnikhil01/new-tube)

**Manual Deployment Steps:**

1. **Push your code to GitHub**
   ```bash
   git push origin main
   ```

2. **Import to Vercel**
   - Go to [vercel.com/new](https://vercel.com/new)
   - Import your GitHub repository
   - Vercel will auto-detect Next.js

3. **Configure Environment Variables**
   - Add all environment variables from `.env.local`
   - Go to Project Settings → Environment Variables

4. **Deploy**
   - Click "Deploy"
   - Vercel will build and deploy automatically

5. **Set up Webhooks**
   - Update webhook URLs in Clerk, Mux, and other services
   - Use your Vercel domain (e.g., `https://your-app.vercel.app/api/...`)

### Other Platforms

NewTube can also be deployed to:
- **Netlify**: Use the Next.js plugin
- **Railway**: Docker deployment
- **AWS**: Using Amplify or EC2
- **Docker**: Build with the included Dockerfile (if added)

---

## 🏗️ Architecture

### Project Structure

```
new-tube/
├── public/              # Static assets
├── src/
│   ├── app/            # Next.js App Router
│   │   ├── (auth)/    # Authentication routes
│   │   ├── (home)/    # Main application routes
│   │   ├── (studio)/  # Creator studio
│   │   └── api/       # API routes & webhooks
│   ├── components/    # Reusable UI components
│   ├── db/           # Database schema & config
│   ├── hooks/        # Custom React hooks
│   ├── lib/          # Utility functions
│   ├── modules/      # Feature modules (tRPC routers)
│   ├── scripts/      # Database seeds & utilities
│   └── trpc/         # tRPC configuration
├── .env.local        # Environment variables
├── drizzle.config.ts # Drizzle ORM config
├── next.config.ts    # Next.js config
├── tailwind.config.ts # Tailwind CSS config
└── tsconfig.json     # TypeScript config
```

### Data Flow

```
User → Next.js Frontend → tRPC → Server Actions → Drizzle ORM → Neon PostgreSQL
                           ↓
                    Clerk (Auth) → Webhooks
                           ↓
                    Mux (Video) → Webhooks
                           ↓
                    Redis (Cache/Rate Limit)
```

---

## 📚 API Documentation

The application uses [tRPC](https://trpc.io/) for type-safe API calls. Available routers:

- **auth**: User authentication and session management
- **videos**: Video CRUD operations, views, reactions
- **comments**: Comment threads and reactions
- **users**: User profiles and subscriptions
- **playlists**: Playlist management
- **categories**: Video categories
- **search**: Search functionality
- **studio**: Creator tools

API routes are available at `/api/trpc/[trpc]`.

---

## 🤝 Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

---

## 📝 License

Distributed under the MIT License. See [LICENSE](LICENSE) for more information.

---

## 👤 Contact

**Nikhil Singh**

- GitHub: [@singhnikhil01](https://github.com/singhnikhil01)
- Repository: [new-tube](https://github.com/singhnikhil01/new-tube)

---

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - The React Framework
- [Vercel](https://vercel.com/) - Deployment Platform
- [Clerk](https://clerk.com/) - Authentication
- [Mux](https://www.mux.com/) - Video Infrastructure
- [Neon](https://neon.tech/) - Serverless Postgres
- [Upstash](https://upstash.com/) - Serverless Redis & Workflows
- [Radix UI](https://www.radix-ui.com/) - UI Components
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [shadcn/ui](https://ui.shadcn.com/) - Component Library

---

<div align="center">
  
  ### ⭐ Star this repository if you find it helpful!
  
  Made with ❤️ by [Nikhil Singh](https://github.com/singhnikhil01)
  
</div>
