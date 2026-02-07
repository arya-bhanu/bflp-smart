'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getSessionId, verifySession } from '@/lib/session'
import type { SessionSoal } from '@/lib/types/soal'

export function SessionRedirect() {
  const router = useRouter()
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    async function checkExistingSession() {
      const sessionId = getSessionId()
      
      if (!sessionId) {
        setIsChecking(false)
        return
      }

      const verification = await verifySession(sessionId)
      
      if (verification.valid && verification.sessions && verification.sessions.length > 0) {
        const firstSession = verification.sessions[0] as SessionSoal
    
        router.push(`/${firstSession.code_name}`)
      } else {
        setIsChecking(false)
      }
    }

    checkExistingSession()
  }, [router])

  if (isChecking) {
    return (
      <div className="fixed inset-0 bg-zinc-50 dark:bg-zinc-900 flex items-center justify-center z-50">
        <p className="text-lg text-zinc-600 dark:text-zinc-400">Checking for existing session...</p>
      </div>
    )
  }

  return null
}
