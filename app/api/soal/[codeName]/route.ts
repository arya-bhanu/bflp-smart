import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ codeName: string }> }
) {
  try {
    const { codeName } = await params
    
    if (!codeName) {
      return NextResponse.json(
        { error: 'code_name parameter is required' },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    const { data, error } = await supabase
      .from('soal')
      .select('code_name, json_file')
      .eq('code_name', codeName)

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    }

    if (!data || data.length === 0) {
      return NextResponse.json(
        { error: 'No data found for this code_name' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: data
    })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    )
  }
}
