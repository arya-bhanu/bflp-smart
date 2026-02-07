import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { session, code_name, current_number } = body

    console.log(session)
    console.log(code_name)
    console.log(current_number)

    if (!session || !code_name || current_number === undefined) {
      return NextResponse.json(
        { error: 'session, code_name, and current_number are required' },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    // Update the current_number for this session
    const { data, error } = await supabase
      .from('session_soal')
      .update({ current_number })
      .eq('session', session)
      .eq('code_name', code_name)
      .select()
      .single()


    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      session: data
    })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    )
  }
}
