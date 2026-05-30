@AGENTS.md
## Forbidden operations

The agent must never modify, create, overwrite, delete, or regenerate:

- `.env`
- `.env.*`
- `*.local`
- secret files
- API keys
- database credentials
- Supabase keys
- Vercel environment files
- Render environment files

The agent must never run:

- `vercel pull`
- `vercel env pull`
- `vercel link`
- `supabase db reset`
- `supabase db push`
- `supabase migration repair`
- `supabase secrets set`
- any command that changes production, staging, or remote environment variables
- any command that modifies a remote database
- any command that deletes data
- any command that rewrites git history
- any command that force-pushes

The agent may create or edit only:

- source code
- tests
- documentation
- `.env.example`

If environment variables are required, the agent must update `.env.example` only and tell the user which real variables must be added manually.

If database changes are required, the agent may only create a migration file and explain it. It must not apply the migration.

If deployment changes are required, the agent may only edit config files after explaining the change. It must not run deployment or environment-sync commands.

Before any potentially destructive operation, the agent must stop and ask for explicit user approval.