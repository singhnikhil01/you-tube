# new-tube

[![Built with TypeScript](https://img.shields.io/badge/Built%20with-TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Built with React](https://img.shields.io/badge/Built%20with-React-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://reactjs.org/)
[![Styled with Tailwind CSS](https://img.shields.io/badge/Styled%20with-Tailwind%20CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Built with Node.js](https://img.shields.io/badge/Built%20with-Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Language](https://img.shields.io/badge/Language-TypeScript-yellow.svg?style=for-the-badge)](https://en.wikipedia.org/wiki/Programming_language)
[![Version](https://img.shields.io/badge/version-TypeScript-blue.svg?style=for-the-badge)]()

`new-tube` is a project aimed at creating a functional clone of the popular video-sharing platform, YouTube. It leverages modern web technologies to provide a responsive and interactive user experience.

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Installation](#installation)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

## Features

Based on the project description and included technologies, `new-tube` is being built with features common to video-sharing platforms. Potential features include:

*   User Authentication (powered by Clerk)
*   Video Upload and Management
*   Video Playback
*   Comment Section
*   Search Functionality
*   Responsive Design
*   Database Integration (using Neon serverless database)

*(Note: The exact implemented features may vary based on the current development state.)*

## Technologies Used

This project is built using the following key technologies and libraries:

*   TypeScript
*   Node.js
*   Next.js (implicitly used via `create-next-app` and project structure)
*   React (implicitly used via Next.js)
*   Tailwind CSS
*   @clerk/nextjs (for authentication)
*   @hookform/resolvers (for form validation)
*   @neondatabase/serverless (for database interactions)
*   @radix-ui/* (various components like accordion, alert-dialog, aspect-ratio, avatar, checkbox, etc.)
*   Drizzle ORM 
*   And many more...

## Installation

To get a local copy up and running, follow these steps:

1.  Clone the repository:
    ```bash
    git clone https://github.com/singhnikhil01/new-tube.git # Replace with actual repo URL
    ```
2.  Navigate to the project directory:
    ```bash
    cd new-tube
    ```
3.  Install dependencies using Bun:
    ```bash
    bun install
    ```
4.  Set up environment variables. You will likely need configuration for Clerk, Neon Database, Ngrok (for webhooks), etc. Create a `.env.local` file in the root directory and add necessary variables (refer to `.env.example` if available, or relevant documentation for the used services).

```bash
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL=/
NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL=/
CLERK_SIGNING_SECRET=
DATABASE_URL=
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=
MUX_TOKEN_SECRET=
MUX_TOKEN_ID=
MUX_WEBHOOK_SECRET=
UPLOADTHING_TOKEN=
```

## Usage

To run the project locally:

*   For basic development server:
    ```bash
    bun run dev:all
    ```
    Open [http://localhost:3000](http://localhost:3000) in your browser.
*   If your application relies on webhooks (e.g., for Clerk or other services) and requires a publicly accessible URL for local development, you may need to run the webhook tunnel alongside the development server. A convenience script `dev:all` is provided:
    ```bash
    bun run dev:all
    ```
    *(Note: The `dev:webhook` script currently uses a hardcoded ngrok URL (`dashing-flamingo-vastly.ngrok-free.app`). You may need to configure Ngrok or a similar tool and update the script or `.env` variables accordingly).*

For production build:

```bash
bun run build
bun run start
```
