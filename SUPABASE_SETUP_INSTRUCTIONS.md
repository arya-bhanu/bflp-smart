# Supabase Setup Instructions

## Step 1: Create the `session_soal` Table

Go to your Supabase Dashboard and follow these steps:

1. Navigate to **SQL Editor** in the left sidebar
2. Click **New query**
3. Copy and paste the contents of `supabase-setup.sql`
4. Click **Run** to execute the query

## Step 2: Verify Table Creation

1. Go to **Table Editor** in the left sidebar
2. You should see the `session_soal` table with the following columns:
   - `id` (bigserial, primary key)
   - `session_id` (text)
   - `code_name` (text)
   - `session_number` (integer)
   - `current_soal` (jsonb)
   - `current_number` (integer)
   - `created_at` (timestamp with time zone)
   - `updated_at` (timestamp with time zone)

## Step 3: Verify RLS Policies

1. Click on the `session_soal` table
2. Go to the **Policies** tab
3. You should see three policies:
   - "Allow insert for all users"
   - "Allow select for all users"
   - "Allow update for all users"

## Step 4: Test the Setup

Run your Next.js app and try to:
1. Navigate to the home page
2. Click on a code_name card
3. Check if a session is created in the `session_soal` table

## Alternative: Quick Setup via Dashboard

If you prefer using the Supabase UI:

### Create Table:
1. Go to **Table Editor** → **New table**
2. Name: `session_soal`
3. Enable RLS: **Yes**
4. Add columns:
   - `id`: type `bigint`, default `auto-generated`, primary key
   - `session_id`: type `text`, required
   - `code_name`: type `text`, required
   - `session_number`: type `int4`, default `1`, required
   - `current_soal`: type `jsonb`, required
   - `current_number`: type `int4`, default `1`, required
   - `created_at`: type `timestamptz`, default `now()`
   - `updated_at`: type `timestamptz`, default `now()`

### Create Policies:
1. Click on the `session_soal` table
2. Go to **Policies** tab → **New Policy**
3. Create three policies (use "Full customization" option):
   
   **Policy 1: Allow INSERT**
   - Name: "Allow insert for all users"
   - Policy command: INSERT
   - Target roles: public
   - WITH CHECK expression: `true`
   
   **Policy 2: Allow SELECT**
   - Name: "Allow select for all users"
   - Policy command: SELECT
   - Target roles: public
   - USING expression: `true`
   
   **Policy 3: Allow UPDATE**
   - Name: "Allow update for all users"
   - Policy command: UPDATE
   - Target roles: public
   - USING expression: `true`
   - WITH CHECK expression: `true`

### Create Index (Optional but Recommended):
1. Go to **SQL Editor**
2. Run:
```sql
CREATE UNIQUE INDEX idx_unique_session_code ON session_soal(session_id, code_name);
CREATE INDEX idx_session_soal_session_id ON session_soal(session_id);
CREATE INDEX idx_session_soal_code_name ON session_soal(code_name);
```

## Troubleshooting

### Error: "new row violates row-level security policy"
- Make sure RLS policies are created correctly
- Verify that the policies target `public` role
- Check that `WITH CHECK` is set to `true` for INSERT policy

### Error: "duplicate key value violates unique constraint"
- This is expected behavior - it means a session already exists for that session_id + code_name combination
- The API will return the existing session instead of creating a new one

### Error: "permission denied for table session_soal"
- Run the GRANT permissions from the SQL script
- Make sure your Supabase API keys are correctly set in `.env.local`

## Environment Variables

Make sure your `.env.local` file contains:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY=your_supabase_anon_key
```

You can find these in your Supabase Dashboard under **Settings** → **API**
