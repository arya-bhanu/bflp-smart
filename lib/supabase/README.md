# Supabase Client Setup

This project is configured with Supabase using the environment variables:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY`

## Files Created

1. **`lib/supabase/client.ts`** - Browser client for Client Components
2. **`lib/supabase/server.ts`** - Server client for Server Components/Actions
3. **`hooks/useSupabase.ts`** - React hooks for easy Supabase usage
4. **`middleware.ts`** - Middleware for automatic session refresh

## Usage Examples

### In Client Components

```tsx
'use client'

import { useSupabase, useSupabaseAuth } from '@/hooks/useSupabase'

export default function ClientComponent() {
  const supabase = useSupabase()
  
  // Or use the auth hook for automatic user state
  const { user, loading, supabase } = useSupabaseAuth()
  
  const fetchData = async () => {
    const { data, error } = await supabase
      .from('your_table')
      .select('*')
    
    if (error) console.error(error)
    return data
  }
  
  return (
    <div>
      {loading ? 'Loading...' : user ? `Hello ${user.email}` : 'Not logged in'}
    </div>
  )
}
```

### In Server Components

```tsx
import { createClient } from '@/lib/supabase/server'

export default async function ServerComponent() {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('your_table')
    .select('*')
  
  if (error) {
    console.error(error)
  }
  
  return (
    <div>
      {/* Render your data */}
    </div>
  )
}
```

### In Server Actions

```tsx
'use server'

import { createClient } from '@/lib/supabase/server'

export async function serverAction() {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('your_table')
    .insert({ column: 'value' })
  
  return { data, error }
}
```

### In API Routes

```tsx
import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('your_table')
    .select('*')
  
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  
  return NextResponse.json({ data })
}
```

## Authentication Examples

### Sign Up

```tsx
const { data, error } = await supabase.auth.signUp({
  email: 'user@example.com',
  password: 'password123',
})
```

### Sign In

```tsx
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'password123',
})
```

### Sign Out

```tsx
const { error } = await supabase.auth.signOut()
```

### OAuth Sign In

```tsx
const { data, error } = await supabase.auth.signInWithOAuth({
  provider: 'google', // or 'github', 'gitlab', etc.
})
```

## Middleware

The middleware automatically refreshes the user's session on every request, ensuring authentication state is always up to date. It's configured to run on all routes except static assets.

## Environment Variables

Make sure your `.env.local` file contains:

```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY=your-anon-key
```

## Learn More

- [Supabase Docs](https://supabase.com/docs)
- [Next.js + Supabase Guide](https://supabase.com/docs/guides/getting-started/quickstarts/nextjs)
