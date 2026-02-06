'use client'

import FingerprintJS from '@fingerprintjs/fingerprintjs'
import { v4 as uuidv4 } from 'uuid'

const SESSION_KEY = 'user_session_id'

export async function getOrCreateSessionId(): Promise<string> {
  // Check if session exists in localStorage
  if (typeof window !== 'undefined') {
    const existingSession = localStorage.getItem(SESSION_KEY)
    if (existingSession) {
      return existingSession
    }
  }

  // Try to generate fingerprint
  try {
    const fp = await FingerprintJS.load()
    const result = await fp.get()
    const sessionId = result.visitorId
    
    if (typeof window !== 'undefined') {
      localStorage.setItem(SESSION_KEY, sessionId)
    }
    
    return sessionId
  } catch (error) {
    // Fallback to UUID if fingerprint fails
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
