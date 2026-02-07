import { cacheTag } from 'next/dist/server/use-cache/cache-tag';
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import type { SoalData, SoalJson } from '@/lib/types/soal'

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

    const { data: existingSession, error: sessionCheckError } = await supabase
      .from('session_soal')
      .select('*')
      .eq('session', session_id)
      .eq('code_name', code_name)
      .maybeSingle()

    if (sessionCheckError) {
      return NextResponse.json(
        { error: sessionCheckError.message },
        { status: 500 }
      )
    }

    if (existingSession) {
      return NextResponse.json({
        success: true,
        session: existingSession,
        isNew: false
      })
    }

    const { data: soalList, error: soalError } = await supabase
      .from('soal')
      .select('code_name, json_file')
      .eq('code_name', code_name)

    if (soalError) {
      return NextResponse.json(
        { error: soalError.message },
        { status: 500 }
      )
    }

    if (!soalList || soalList.length === 0) {
      return NextResponse.json(
        { error: 'No soal found for this code_name' },
        { status: 404 }
      )
    }

    const randomIndex = Math.floor(Math.random() * soalList.length)
    const selectedSoal = soalList[randomIndex] as SoalData
    const currentSoal = selectedSoal.json_file as SoalJson

    const { data: newSession, error: insertError } = await supabase
      .from('session_soal')
      .insert({
        session: session_id,
        code_name: code_name,
        current_soal: currentSoal,
        current_number: 1
      })
      .select()
      .single()

  
    if (insertError) {
      // If it's a duplicate key error, fetch and return the existing session
      if (insertError.code === '23505') {
        const { data: existingData, error: fetchError } = await supabase
          .from('session_soal')
          .select('*')
          .eq('session', session_id)
          .eq('code_name', code_name)
          .single()

        if (fetchError || !existingData) {
          return NextResponse.json(
            { error: 'Failed to fetch existing session' },
            { status: 500 }
          )
        }

        return NextResponse.json({
          success: true,
          session: existingData,
          isNew: false
        })
      }

      return NextResponse.json(
        { error: insertError.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      session: newSession,
      isNew: true
    })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    )
  }
}
