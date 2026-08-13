# Agent Analytics Frontend

Maruti Suzuki Analytics Dashboard — React + Vite + TypeScript.

## Local development

```bash
npm install
npm run dev
```

Set `VITE_API_URL` in `frontend/.env` to your backend URL (e.g. `http://localhost:8000`).

## Build

```bash
npm run build
```

Output is in `frontend/dist/`.

## Deploy on Netlify

1. Go to [app.netlify.com](https://app.netlify.com) → **Add new site** → **Import an existing project**
2. Connect **GitHub** and select `Ayush956/AgentAnalyticsFrontend`
3. Netlify reads `netlify.toml` automatically — no build settings to change
4. Under **Site configuration → Environment variables**, add:

   | Key | Value |
   |-----|--------|
   | `VITE_API_URL` | Your production backend URL (e.g. `https://your-api.onrender.com`) |

5. Click **Deploy site**

After deploy, allow your Netlify URL in the backend CORS config (e.g. `https://your-site.netlify.app`).

## Demo login

- `executive@maruti.com` / `secret123`
- `analyst@maruti.com` / `secret123`
