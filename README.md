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

## Deploy (static hosting)

1. Build with your production API URL:

   ```bash
   cd frontend
   echo "VITE_API_URL=https://your-backend.example.com" > .env
   npm run build
   ```

2. Deploy the `frontend/dist` folder to Vercel, Netlify, Cloudflare Pages, or any static host.

3. Ensure your backend allows CORS from your frontend domain.

## Demo login

- `executive@maruti.com` / `secret123`
- `analyst@maruti.com` / `secret123`
