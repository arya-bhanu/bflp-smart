'use client'

import FingerprintJS from '@fingerprintjs/fingerprintjs'
import { v4 as uuidv4 } from 'uuid'

const SESSION_KEY = 'user_session_id'

export async function getOrCreateSessionId(): Promise<string> {
  if (typeof window !== 'undefined') {
    const existingSession = localStorage.getItem(SESSION_KEY)
    if (existingSession) {
      return existingSession
    }
  }

  try {
    const fp = await FingerprintJS.load()
    const result = await fp.get()
    const sessionId = result.visitorId
    
    if (typeof window !== 'undefined') {
      localStorage.setItem(SESSION_KEY, sessionId)
    }
    
    return sessionId
  } catch (error) {
  
    console.warn('Fingerprint generation failed, using UUID:', error)
    const sessionId = uuidv4()
    
    if (typeof window !== 'undefined') {
      localStorage.setItem(SESSION_KEY, sessionId)
    }
    
    return sessionId
  }
}

export function getSessionId(): string | null {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(SESSION_KEY)
  }
  return null
}

export function clearSession(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(SESSION_KEY)
  }
}

export async function verifySession(sessionId: string): Promise<{ valid: boolean; sessions?: unknown[] }> {
  try {
    const response = await fetch('/api/session/verify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        session_id: sessionId,
      }),
    })

    const result = await response.json()

    if (!response.ok) {
      return { valid: false }
    }

    return {
      valid: result.valid,
      sessions: result.sessions || []
    }
  } catch (error) {
    console.error('Session verification failed:', error)
    return { valid: false }
  }
}
