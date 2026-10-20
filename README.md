# Birthday Automation web app

The hosted app uses Next.js, Better Auth, Prisma/PostgreSQL, and server-side Supabase Storage. The Vite app remains available as a local-only prototype with `npm run dev:vite`; it is not the hosted customer-data backend.

## Local environment

Keep the root `.env` file outside source control. The Next scripts load it from the repository root. Set `BETTER_AUTH_SECRET` to a private random value of at least 32 characters before starting the app. Do not expose any server secrets through `NEXT_PUBLIC_*` variables.

```powershell
cd web
npm install
npm run dev
```

## Admin bootstrap

Public sign-up is disabled. After the Better Auth tables are created in the dedicated Birthday Automation Supabase project and the server environment is configured, create the first administrator from this directory. The command prompts for the password; use a unique password with at least 12 characters and do not put it in shell history or chat.

```powershell
npx auth@latest create-admin --config src/lib/auth.ts --email $env:ADMIN_INITIAL_EMAIL --name "Birthday Admin" --role admin --data '{"username":"admin","displayUsername":"admin"}'
```

The username `admin` is the login name. The password `12345` is not used because it is too weak for an internet-facing administrator account.

## Deployment boundary

Vercel Preview is the intended first deployment. Configure the required server variables in the Vercel project settings; do not upload `.env` or the raw customer export. No customer scheduler or production sending is enabled by this app setup. Use only the dedicated Supabase project `mudruljnsexahvapkmep`, never the Sanghyang News or VOLA projects.

The customer dispatcher at `/api/cron/birthday-dispatch` is deliberately locked unless all of these are set in the Production environment: `VERCEL_ENV=production` (provided by Vercel), `CUSTOMER_SENDS_ENABLED=true`, `EMAIL_SANDBOX_MODE=false`, and a valid `Authorization: Bearer <CRON_SECRET>` header. Do not configure a Vercel cron schedule until the owner completes manual review and authorizes production cutover. SMTP acceptance is not proof of inbox delivery; ambiguous results are not retried automatically.
