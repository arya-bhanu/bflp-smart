'use client'

import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"
import { getOrCreateSessionId } from "@/lib/session"
import type { SessionSoal, SoalJson } from "@/lib/types/soal"

interface SessionResponse {
  success: boolean
  session: SessionSoal
  isNew: boolean
  error?: string
}

export default function CodeNamePage() {
  const params = useParams()
  const router = useRouter()
  const codeName = params.codeName as string
  const [session, setSession] = useState<SessionSoal | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function initSession() {
      try {
        // Get or create session ID
        const sessionId = await getOrCreateSessionId()

        // Start session with the backend
        const response = await fetch('/api/session/start', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            session_id: sessionId,
            code_name: codeName,
          }),
        })

        const result: SessionResponse = await response.json()

        if (!response.ok) {
          throw new Error(result.error || 'Failed to start session')
        }

        setSession(result.session)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to initialize session')
      } finally {
        setLoading(false)
      }
    }

    initSession()
  }, [codeName])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-zinc-900">
        <p className="text-lg text-zinc-600 dark:text-zinc-400">Loading...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <Button
            variant="outline"
            onClick={() => router.push('/')}
            className="mb-6"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Code Names
          </Button>
          <div className="flex items-center justify-center py-12">
            <p className="text-lg text-red-600 dark:text-red-400">Error: {error}</p>
          </div>
        </div>
      </div>
    )
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <Button
            variant="outline"
            onClick={() => router.push('/')}
            className="mb-6"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Code Names
          </Button>
          <p className="text-center text-zinc-600 dark:text-zinc-400">No session data available.</p>
        </div>
      </div>
    )
  }

  const soalData = session.current_soal as SoalJson

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <Button
          variant="outline"
          onClick={() => router.push('/')}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Code Names
        </Button>
        
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50 mb-2">
            {soalData.title}
          </h1>
          <div className="flex items-center gap-4 text-sm text-zinc-600 dark:text-zinc-400">
            <span>Code: {session.code_name}</span>
            <span>•</span>
            <span>Session: {session.session_number}</span>
            <span>•</span>
            <span>Question: {session.current_number}/{soalData.total_questions}</span>
            <span>•</span>
            <span>Source: {soalData.source_document}</span>
          </div>
        </div>
        
        <div className="space-y-6">
          {soalData.sections.map((section, sectionIndex) => (
            <Card key={sectionIndex} className="bg-white dark:bg-zinc-800">
              <CardHeader>
                <CardTitle className="text-xl text-zinc-900 dark:text-zinc-50">
                  {section.category}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {section.questions.map((question) => (
                    <div key={question.no} className="border-b border-zinc-200 dark:border-zinc-700 pb-4 last:border-0 last:pb-0">
                      <div className="flex gap-4">
                        <span className="font-semibold text-zinc-900 dark:text-zinc-50 shrink-0">
                          {question.no}.
                        </span>
                        <div className="flex-1">
                          <p className="text-zinc-900 dark:text-zinc-50 mb-2">
                            {question.question}
                          </p>
                          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md px-3 py-2">
                            <span className="text-sm font-medium text-green-800 dark:text-green-200">
                              Answer: {question.answer}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
