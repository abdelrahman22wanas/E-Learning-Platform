# Frontend

This folder contains the React + Vite frontend for the E-Learning Platform.

## Run locally

1. Install dependencies:
   - `npm install`
2. Start the Vite dev server:
   - `npm run dev`
3. Make sure the Django API is running on `http://127.0.0.1:8000`

## API base URL

By default the frontend uses `/api`.

You can override it with:

```bash
VITE_API_BASE_URL=http://127.0.0.1:8000/api
```

## Build

```bash
npm run build
```
