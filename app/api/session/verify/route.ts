import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { session_id } = body

    if (!session_id) {
      return NextResponse.json(
        { error: 'session_id is required' },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    // Check if any session exists for this session_id
    const { data: sessions, error } = await supabase
      .from('session_soal')
      .select('*')
      .eq('session', session_id)

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    }

    // If no sessions found, session is invalid
    if (!sessions || sessions.length === 0) {
      return NextResponse.json({
        success: false,
        valid: false,
        message: 'No sessions found for this session_id'
      })
    }

    // Return all sessions for this user
    return NextResponse.json({
      success: true,
      valid: true,
      sessions: sessions
    })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    )
  }
}
