# PigTrack Pro Mobile

React + TypeScript recreation of the original PHP/XAMPP piggery management system. It is designed first as an iOS-friendly PWA, with Capacitor included for a later native iOS shell.

## Features

- Installable mobile PWA for iPhone, iPad, Android, and desktop.
- Optional Capacitor iOS wrapper using the same React codebase.
- Supabase Auth + Postgres for free hosted backend use.
- Demo mode when Supabase keys are not configured.
- Modules for dashboard, pigs, pens, weights, breeding, health, feeding, feed inventory, sales, expenses, reports, tasks, users, and breeds.
- MySQL/XAMPP migration script for the original `piggery_db` data.
- Netlify configuration for free HTTPS deployment.

## Tools Needed

- VS Code or IntelliJ IDEA Ultimate/WebStorm.
- Node.js 20 or newer.
- Git and a GitHub account for deployment.
- Supabase free project for hosted authentication/database.
- Netlify or Vercel free account for secure HTTPS hosting.
- For native iOS only: macOS, Xcode, CocoaPods if Xcode asks for it, and an Apple Developer account for App Store/TestFlight publishing.

## Recommended Setup In VS Code Or IntelliJ

```bash
cd pigtrack-pwa
npm install
npm run dev
```

Open the local Vite URL shown in the terminal. If Windows PowerShell blocks `npm`, use:

```bash
npm.cmd run dev
```

Without Supabase keys, the app runs in demo mode using sample data.

## Connect Supabase

1. Create a free project at Supabase.
2. Open the Supabase SQL Editor.
3. Run `supabase/schema.sql`.
4. Create your first user in Supabase Authentication.
5. Insert a matching profile row:

```sql
insert into profiles (id, username, full_name, role, email, status)
values ('AUTH_USER_UUID_HERE', 'admin', 'Farm Administrator', 'admin', 'your@email.com', 'active');
```

6. Copy `.env.example` to `.env.local`.
7. Set:

```bash
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

8. Restart `npm run dev`.

## Import Existing XAMPP Data

Run the Supabase schema first, then import from your local MySQL database:

```bash
set MYSQL_HOST=127.0.0.1
set MYSQL_PORT=3307
set MYSQL_USER=root
set MYSQL_PASSWORD=
set MYSQL_DATABASE=piggery_db
set SUPABASE_URL=https://your-project.supabase.co
set SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
npm run import:mysql
```

Use the Supabase service role key only on your computer. Do not put it in `.env.local`, GitHub, Netlify, or Vercel.

## iPhone/iPad PWA Display

1. Deploy the app to Netlify or Vercel so it has HTTPS.
2. Open the deployed URL in Safari on iPhone or iPad.
3. Tap Share.
4. Tap Add to Home Screen.
5. Launch PigTrack Pro from the home screen.

This is the fastest free iOS deployment path. It does not require App Store review.

## Native iOS With Capacitor

Capacitor is configured in `capacitor.config.ts`. Native iOS generation must be done on macOS:

```bash
npm install
npm run build
npm run mobile:add:ios
npm run mobile:sync
npm run mobile:open:ios
```

Then use Xcode to run the app on an iOS simulator or iPhone. After web changes, run:

```bash
npm run mobile:sync
```

## Deploy Free And Secure

### GitHub Pages

This repo includes `.github/workflows/deploy-pages.yml`.

1. Push to GitHub.
2. Open the GitHub repo settings.
3. Go to Pages.
4. Set Source to GitHub Actions.
5. Wait for the deploy workflow to finish.
6. Open `https://jhoncarlo-hub.github.io/PorkFolio/`.

On iPhone or iPad, open that URL in Safari, tap Share, then Add to Home Screen.

### Netlify

1. Push `pigtrack-pwa` to GitHub.
2. Import the repo in Netlify.
3. Build command: `npm run build`.
4. Publish directory: `dist`.
5. Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in Netlify environment variables.
6. Deploy. Netlify provides HTTPS automatically.

### Vercel

1. Import the GitHub repo in Vercel.
2. Framework: Vite.
3. Build command: `npm run build`.
4. Output directory: `dist`.
5. Add the same Supabase environment variables.

## System Design

See `docs/system-design.md` for the architecture, data flow, security model, mobile strategy, and folder structure.

## Useful Commands

```bash
npm run dev
npm run build
npm run lint
npm run preview
npm run import:mysql
npm run mobile:sync
```
