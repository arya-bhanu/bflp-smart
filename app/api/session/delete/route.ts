import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { session_id, code_name } = body

    if (!session_id || !code_name) {
      return NextResponse.json(
        { error: 'session_id and code_name are required' },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    // Delete the session from session_soal table
    const { error: deleteError } = await supabase
      .from('session_soal')
      .delete()
      .eq('session', session_id)
      .eq('code_name', code_name)

    if (deleteError) {
      return NextResponse.json(
        { error: deleteError.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Session deleted successfully'
    })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    )
  }
}
