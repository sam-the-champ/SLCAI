# SLCAI

Solace is a mental health first-aid web app built with React, TypeScript, and Vite. It helps users express how they're feeling, assesses mood using an AI-powered triage flow, and offers a supportive chat experience plus a local mood journal.

## Features

- Mood check-in interface with quick feeling buttons
- Voice transcript support for hands-free journaling
- AI-based mood assessment and triage using OpenRouter
- Follow-up conversational companion with empathy-focused responses
- Local browser journal storage for recent entries
- Built with React 19, TypeScript, Vite, and Tailwind CSS

## Getting Started

### Prerequisites

- Node.js 20+ and npm
- An OpenRouter API key

### Install Dependencies

```bash
cd solace
npm install
```

### Environment Variables

Create a `.env` file inside `solace/` with your OpenRouter API key:

```env
VITE_OPENROUTER_API_KEY=your_openrouter_api_key_here
```

### Run Locally

```bash
cd solace
npm run dev
```

Open the URL shown in the terminal (typically `http://localhost:5173`).

## Build

```bash
cd solace
npm run build
```

## Preview

```bash
cd solace
npm run preview
```

## Scripts

- `npm run dev` — start the Vite development server
- `npm run build` — compile and bundle the project
- `npm run preview` — preview production build locally
- `npm run lint` — run ESLint checks

## Project Structure

- `solace/src/App.tsx` — main app shell and screen flow
- `solace/src/components/` — UI components for assessment, chat, journal, and voice input
- `solace/src/lib/` — AI integration, local journal storage, and shared types
- `solace/src/index.css` — global styling

## AI Integration

Solace uses OpenRouter's chat completions endpoint with the `google/gemma-4-31b` model.
The mood assessment step returns structured JSON with:

- `triageLevel`
- `summary`
- `patterns`
- `strategies`
- `affirmation`

A follow-up chat mode uses a second prompt to generate empathetic responses, with special handling for crisis-level messages.

## Notes

- Journal entries are saved locally in the browser using `localStorage`.
- The app is not a replacement for professional care.
- Make sure your OpenRouter API key is valid and available to the browser via Vite.


