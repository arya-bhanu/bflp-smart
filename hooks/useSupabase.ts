import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export function useSupabase() {
  const [supabase] = useState(() => createClient())
  return supabase
}

export function useSupabaseAuth() {
  const supabase = useSupabase()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [supabase])

  return { user, loading, supabase }
}
