'use client'

import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, CheckCircle2 } from "lucide-react"
import { getOrCreateSessionId, verifySession, clearSession } from "@/lib/session"
import { Flashcard } from "@/components/flashcard"
import type { SessionSoal, SoalJson, Question } from "@/lib/types/soal"

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
  const [sessionId, setSessionId] = useState<string>("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isUpdating, setIsUpdating] = useState(false)

  useEffect(() => {
    async function initSession() {
      try {
        const sid = await getOrCreateSessionId()
        setSessionId(sid)

        const verification = await verifySession(sid)
        
        if (!verification.valid) {
          clearSession()

          const newSid = await getOrCreateSessionId()
          setSessionId(newSid)

          const response = await fetch('/api/session/start', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              session_id: newSid,
              code_name: codeName,
            }),
          })

          const result: SessionResponse = await response.json()

          if (!response.ok) {
            throw new Error(result.error || 'Failed to start session')
          }

          setSession(result.session)
        } else {
          const existingSession = verification.sessions?.find(
            (s: unknown) => (s as SessionSoal).code_name === codeName
          )

          if (existingSession) {
            setSession(existingSession as SessionSoal)
          } else {
            const response = await fetch('/api/session/start', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                session_id: sid,
                code_name: codeName,
              }),
            })

            const result: SessionResponse = await response.json()

            if (!response.ok) {
              throw new Error(result.error || 'Failed to start session')
            }

            setSession(result.session)
          }
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to initialize session')
      } finally {
        setLoading(false)
      }
    }

    initSession()
  }, [codeName])

  const handleBack = async () => {
    try {
      if (sessionId && codeName) {
        await fetch('/api/session/delete', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            session_id: sessionId,
            code_name: codeName,
          }),
        })
      }
     
      clearSession()

      router.push('/')
    } catch (err) {
      console.error('Failed to clean up session:', err)
      clearSession()
      router.push('/')
    }
  }

  const handleNext = async () => {
    if (!session || !sessionId) return

    const soalData = session.current_soal as SoalJson
    const allQuestions = getAllQuestions(soalData)
    const nextNumber = session.current_number + 1

    if (nextNumber > allQuestions.length) {
      return
    }

    setIsUpdating(true)
    try {
      const response = await fetch('/api/session/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          session: sessionId,
          code_name: codeName,
          current_number: nextNumber,
        }),
      })

      const result = await response.json()
      

      if (!response.ok) {
        throw new Error(result.error || 'Failed to update session')
      }

      setSession(result.session)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update progress')
    } finally {
      setIsUpdating(false)
    }
  }

  const getAllQuestions = (soalData: SoalJson): Question[] => {
    return soalData.sections.flatMap(section => section.questions)
  }

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
            onClick={handleBack}
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
            onClick={handleBack}
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
  const allQuestions = getAllQuestions(soalData)
  const currentQuestion = allQuestions[session.current_number - 1]
  const isCompleted = session.current_number > allQuestions.length

  if (isCompleted) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <Button
            variant="outline"
            onClick={handleBack}
            className="mb-6"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Code Names
          </Button>

          <Card className="bg-white dark:bg-zinc-800 shadow-xl">
            <CardContent className="p-12 text-center">
              <div className="flex justify-center mb-6">
                <CheckCircle2 className="w-20 h-20 text-green-600" />
              </div>
              <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50 mb-4">
                Congratulations! 🎉
              </h1>
              <p className="text-lg text-zinc-600 dark:text-zinc-400 mb-8">
                You&apos;ve completed all {allQuestions.length} questions in &quot;{soalData.title}&quot;
              </p>
              <Button
                onClick={handleBack}
                size="lg"
                className="px-8"
              >
                Back to Home
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <Button
            variant="outline"
            onClick={handleBack}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          
          <div className="text-right">
            <h2 className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
              {soalData.title}
            </h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-500">
              Code: {session.code_name}
            </p>
          </div>
        </div>

        {isUpdating ? (
          <div className="flex items-center justify-center py-20">
            <p className="text-lg text-zinc-600 dark:text-zinc-400">Loading next question...</p>
          </div>
        ) : (
          <Flashcard
            question={currentQuestion}
            onNext={handleNext}
            isLastQuestion={session.current_number === allQuestions.length}
            questionNumber={session.current_number}
            totalQuestions={allQuestions.length}
          />
        )}
      </div>
    </div>
  )
}
