# Kanchan Yadav — Portfolio

Personal portfolio of Kanchan Yadav, a B.Tech CSE student at SRM University-AP who builds full-stack products and AI/LLM systems (RAG pipelines, multi-agent systems, LangGraph).

The design is editorial and uses a strict two-colour palette: charcoal `#2A2529` and ivory `#F3F0E7`. It includes a flowing particle-field hero, scroll-driven text reveals, designed project covers with a cursor-following preview, a scroll-reactive marquee and a line-drawn cat cursor that turns into a planet over the project covers. Visitors who set "reduce motion" in their system get static versions of all animations.

## Tech Stack

- **Frontend:** React 19 (Vite), Tailwind CSS v4, GSAP + ScrollTrigger, Lenis smooth scroll
- **Backend (optional):** Node.js, Express.js, MongoDB (Mongoose) — powers the contact form API and GitHub sync
- **Utilities:** Node-cron (scheduled syncing), Axios (GitHub API fetch)

## Editing content

All text, projects, skills, links, stats and certifications live in one file: [`client/src/data/portfolio.js`](client/src/data/portfolio.js). Section headings use `*asterisks*` to set a word in italic.

The contact form posts to `/api/contact` when the backend is running. If the backend isn't running, as on a static Vercel or Netlify deploy, the form opens the visitor's email app instead.

---

## Project Structure

```text
portfolio/
├── client/              # React Frontend (Vite)
│   ├── public/          # Static assets (place your resume.pdf here)
│   └── src/             # Frontend source code
│       ├── components/  # Page sections and UI components
│       └── main.jsx     # App entry
├── server/              # Express Backend
│   └── src/             # Backend source code
│       ├── config/      # DB Connection
│       ├── models/      # Mongoose schemas (Projects, Messages)
│       ├── routes/      # API endpoints (/api/projects, /api/contact)
│       └── services/    # GitHub Sync Cron Service
└── README.md            # You are here
```

---

## Local Setup & Installation

### Prerequisites
- [Node.js](https://nodejs.org/) installed (v18+ recommended)
- [MongoDB](https://www.mongodb.com/try/download/community) installed and running locally, or a MongoDB Atlas connection string.

### 1. Configure Backend Server
Navigate to the `server/` directory, set up variables, and install dependencies:
```bash
cd server
npm install
```

Create a `.env` file in the `server/` folder (we have pre-filled one for you, but verify details):
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/portfolio
GITHUB_USERNAME=y-kanchan
GITHUB_TOKEN=   # Optional: highly recommended to bypass GitHub API rate limits
CONTACT_EMAIL=kanchanyadav0916@gmail.com
```

### 2. Run the Initial Sync
To fetch your repositories and populate the database immediately, run the manual sync script:
```bash
npm run sync
```

### 3. Configure Frontend Client
Navigate to the `client/` directory and install dependencies:
```bash
cd ../client
npm install
```

---

## Running the Application Locally

You need to run both the frontend and backend servers.

### Start Backend Server (runs on Port 5000)
From the `server/` directory:
```bash
npm run dev
```

### Start Frontend Client (runs on Port 3000)
From the `client/` directory:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser. The Vite server is configured to proxy API requests (like `/api/projects`) directly to the backend.

---

## GitHub Auto-Sync Service

- A scheduled `node-cron` job runs every **12 hours** to fetch repository metadata (stars, description, primary language, topics/tags, and update timestamp) from GitHub's REST API.
- **Survivable Overrides:** If you edit a project in the database (e.g. set `isFeatured = true`, rename description with `customDescription`, add an image to `customImage`, or hide a repository by setting `isHidden = true`), these custom fields **persist** across sync cycles.
- **Cleanup:** Synced projects that are deleted or made private on GitHub are automatically removed from the database during the sync. Manual projects (which do not have a `githubId`) are left untouched.

---

## Deployment Guidelines

### Database (MongoDB Atlas)
1. Create a free cluster on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Get your connection string and add it to your server's production environment as `MONGODB_URI`. Make sure to allow IP access in the Atlas panel.

### Backend (Render / Railway)
1. Deploy the `server/` folder to a service like Render or Railway.
2. Define environment variables in their dashboard:
   - `MONGODB_URI`
   - `GITHUB_USERNAME=y-kanchan`
   - `GITHUB_TOKEN` (highly recommended)
   - `CONTACT_EMAIL=kanchanyadav0916@gmail.com`
   - `PORT=5000`

### Frontend (Vercel / Netlify)
1. Deploy the `client/` folder. Netlify picks up the root `netlify.toml`, and Vercel uses `client/vercel.json` (set the project's root directory to `client`).
2. Ensure you set the environment variable pointing to your deployed backend. (In `vite.config.js`, you can set the proxy for local development, and in production, you can configure your API calls to fetch from your backend URL).
