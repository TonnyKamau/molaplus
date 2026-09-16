# Supabase Studio Backend

This project can keep using the local SQLite studio, or switch the publishing studio to Supabase Auth plus the `molaplus-studio` Edge Function.

## Setup

1. Run the migration in `supabase/migrations/20260915000000_molaplus_studio.sql`.
2. Create an editor in Supabase Authentication > Users.
3. Edit `supabase/authorize-editor.sql` with the editor email, then run it.
4. Deploy the function:

```bash
supabase functions deploy molaplus-studio --project-ref acgjxvqcwpeuclcfvgak
```

5. Set these app env vars:

```ini
STUDIO_BACKEND=supabase
NEXT_PUBLIC_SUPABASE_URL=https://acgjxvqcwpeuclcfvgak.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=...
```

The Edge Function verifies the signed-in Supabase user against `public.blog_editors` before it reads or writes studio content.
