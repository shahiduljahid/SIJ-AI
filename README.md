# SIJ-AI

## New Supabase Database Setup

If your old Supabase project expired or was reset, create a new Supabase project and then apply the app schema again.

1. Open your new Supabase project and go to the SQL Editor.
2. Run [supabase_migration.sql](supabase_migration.sql) to create the schema and backfill missing profiles.
3. If you only want the original schema bootstrap, you can also run [setup_db.sql](setup_db.sql).
4. Make sure these tables exist after the script runs:
	- `profiles`
	- `chats`
	- `messages`
	- `context_items`
5. Copy the new project values from Supabase Dashboard → Settings → API.
6. Update [.env](.env) with the new values:
	- `NEXT_PUBLIC_SUPABASE_URL`
	- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
7. Restart the app and rebuild if needed:
	- `pnpm build`
	- `pnpm start`

Notes:

- Use the public anon key for `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
- Do not use the service role key in the frontend.
- If billing or subscription errors still appear, also set `NEXT_PUBLIC_UPDATE_PUBLISHABLE_KEY`.
