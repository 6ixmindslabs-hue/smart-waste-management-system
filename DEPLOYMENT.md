# Deploying to Vercel

This project is ready to deploy as one Vercel app:

- React/Vite frontend
- `/api/*` backend serverless functions
- Supabase database
- ESP32 hardware posts data to the deployed API URL

## 1. Prepare Supabase

Open your Supabase project, go to SQL Editor, and run the full contents of:

```text
supabase_schema.sql
```

The deployed backend expects these lowercase columns:

```text
deviceid
fillpercentage
createdat
```

## 2. Environment Variables

In Vercel, add these variables to the project for Production, Preview, and Development:

```env
SUPABASE_URL=https://ooutzstxmaabambjrgvs.supabase.co
SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_SUPABASE_URL=https://ooutzstxmaabambjrgvs.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Do not add the Supabase `service_role` key to the frontend app.

## 3. Deploy From GitHub

1. Push this project to GitHub.
2. Open Vercel.
3. Click **Add New > Project**.
4. Import your GitHub repository.
5. Vercel should detect **Vite** automatically.
6. Add the environment variables above.
7. Click **Deploy**.

After deployment, Vercel gives you a URL like:

```text
https://your-project-name.vercel.app
```

## 3B. Deploy From Terminal

You can also deploy directly from this project folder:

```powershell
npm run deploy
```

The first time, Vercel will ask you to log in and link/create a project. Choose the current folder when prompted.

## 4. Hardware Server URL

Use this URL in the ESP32 code:

```text
https://your-project-name.vercel.app/api/bin/update
```

Example:

```cpp
const char* serverUrl = "https://your-project-name.vercel.app/api/bin/update";
```

The ESP32 should send:

```json
{
  "deviceId": "BIN001",
  "fillPercentage": 75
}
```

## 5. Test The Deployment

After deploy, test the backend from your computer:

```powershell
npm run verify:backend -- https://your-project-name.vercel.app
```

Or manually:

```powershell
Invoke-RestMethod -Method Post "https://your-project-name.vercel.app/api/bin/update" -ContentType "application/json" -Body '{"deviceId":"BIN001","fillPercentage":75}'
```

Then open:

```text
https://your-project-name.vercel.app
```

## 6. Redeploy After Env Changes

If you change environment variables in Vercel, redeploy the project. Vercel applies environment variable changes only to new deployments.
