import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export function useSupabase() {
  const [supabase] = useState(() => createClient())
  return supabase
}
