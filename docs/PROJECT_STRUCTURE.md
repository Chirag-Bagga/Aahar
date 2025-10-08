# Aahar Project Structure & Component Guide

This document outlines the current file layout and summarizes the purpose of every front-end component, page, utility, and supporting server module in the repository. Use it as a quick reference when sharing the project with another assistant or planning follow-up work.

## Top-level layout

- `client/` – React + Vite single-page application that renders the farmer experience (dashboard, marketplace, etc.).
- `server/` – Express.js API scaffold that hosts REST endpoints behind `/api`.
- `node_modules/` – Installed dependencies (excluded from version control).
- `package.json` / `package-lock.json` – Monorepo-level scripts and shared dependencies (uses `npm` workspaces).
- `tsconfig.base.json` – Shared TypeScript configuration inherited by client and server builds.
- `docs/` – Project documentation (this folder).

## Client application (`client/`)

### Build & tooling files

- `client/index.html` – Vite HTML entry point; now loads Tailwind CSS via CDN and mounts the React bundle.
- `client/vite.config.ts` – Vite configuration (aliases, React plugin, etc.).
- `client/tsconfig*.json` – TypeScript build targets for the app and node-based tooling.
- `client/README.md` – Default Vite README with commands to run or build the client bundle.

### Source directory (`client/src/`)

- `main.tsx` – React entry file that mounts `<App />` inside `<BrowserRouter>` and pulls in global CSS.
- `App.tsx` – Root component that renders the persistent `<Header />`, route switcher, and global `<Chatbot />` widget.
- `App.css` – Legacy Vite starter styles (currently unused but still present).
- `index.css` – Global base styles (colors, fonts, and language switcher presentation).
- `translationService.tsx` – Utility for translating strings via the backend with caching + TTL in `localStorage`.
- `languageSwitcher.tsx` – Dropdown component that wires `translationService` to DOM nodes marked with `data-translate`.

#### Assets (`client/src/assets/`)

- `hero.jpeg` – Hero illustration used on the home and login screens.
- `logo.svg` – Aahar logomark for the header and login form.
- `question_mark.svg` – Icon displayed inside the feature cards on the home page.
- `react.svg` – Default Vite React logo (unused by current UI but still in assets folder).

#### Reusable components (`client/src/components/`)

- `header.tsx` – Sticky site navigation bar with logo and quick links.
- `header.css` – Dedicated styles for the header (glassmorphism background, hover underline animation, responsive tweaks).
- `chatbot.tsx` – Floating chat widget: manages open state, message history, API calls, optimistic updates, and loading states.
- `npkplots.tsx` – Wrapper around `recharts` that plots optimal vs. current NPK values in a responsive bar chart.

#### Pages (`client/src/pages/`)

- `Home.tsx` – Landing page featuring a hero banner, “What We Provide” highlight cards, and the global language switcher.
- `Home.css` – Styling for the home page layout (grid hero, cards, responsive typography).
- `Login.tsx` – Phone-based login form alongside the hero image; transitions users to the dashboard route.
- `Dashboard.tsx` – Fetches fertiliser predictions, shows weather metrics, renders an OpenStreetMap embed, and visualises NPK data + prediction metrics using `NpkPlot` and progress cards.
- `DiseaseDetection.tsx` – Upload form that sends crop images to the disease prediction API and displays confidence, fertiliser, and treatment guidance.
- `Marketplace.tsx` – Static product catalogue with cart management (add/remove items and INR totals) for agricultural supplies.

#### Services (`client/src/services/`)

- `api/client.ts` – Minimal fetch wrapper targeting the API base URL with JSON defaults and credential support.

## Server application (`server/`)

### Build & tooling files

- `server/tsconfig.json` – TypeScript config for the Express server build.
- `server/package.json` – Server-specific scripts (build, start, lint) and dependencies.

### Source directory (`server/src/`)

- `index.ts` – Entry point that boots the Express app and listens on the configured port.
- `app.ts` – Express factory that configures security middleware (Helmet, CORS), JSON parsing, logging, routes, and error handling.
- `routes/index.ts` – Router registering health or future feature endpoints under `/api`.
- `controllers/health.controller.ts` – Simple health check handler returning uptime metadata.
- `middlewares/error.ts` – Central error handler that normalises thrown errors to JSON responses.
- `config/env.ts` – Loads environment variables (port, CORS origin) with runtime validation/defaults.

## Additional notes

- **Environment variables**: The client relies on several Vite-prefixed variables (e.g. `VITE_CHATBOT_URL`, `VITE_API_URL`, `VITE_TRANSLATE_URL`, `VITE_DISEASE_PREDICT_URL`) to override default endpoints without code changes.
- **Data attributes**: Many UI strings use `data-translate="message"` so the language switcher can detect and translate content in-place.
- **Styling approach**: Tailwind classes coexist with bespoke CSS modules (`header.css`, `Home.css`) and global base styles in `index.css`.

