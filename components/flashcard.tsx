'use client'

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import type { Question } from "@/lib/types/soal"

interface FlashcardProps {
  question: Question
  onNext: () => void
  isLastQuestion: boolean
  questionNumber: number
  totalQuestions: number
}

export function Flashcard({ question, onNext, isLastQuestion, questionNumber, totalQuestions }: FlashcardProps) {
  const [userAnswer, setUserAnswer] = useState("")
  const [isRevealed, setIsRevealed] = useState(false)
  const [isFlipping, setIsFlipping] = useState(false)

  const handleReveal = () => {
    setIsFlipping(true)
    setTimeout(() => {
      setIsRevealed(true)
      setIsFlipping(false)
    }, 300)
  }

  const handleNext = () => {
    setUserAnswer("")
    setIsRevealed(false)
    onNext()
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="mb-4 text-center">
        <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
          Question {questionNumber} of {totalQuestions}
        </span>
      </div>

      <div className="relative perspective-1000">
        <div
          className={`transform-style-3d transition-transform duration-500 ${
            isFlipping ? 'rotate-y-180' : ''
          }`}
        >
          {!isRevealed ? (
            <Card className="bg-white dark:bg-zinc-800 shadow-xl min-h-100">
              <CardContent className="p-8">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm font-medium text-zinc-500 dark:text-zinc-400 mb-2">
                      Question
                    </h3>
                    <p className="text-xl font-medium text-zinc-900 dark:text-zinc-50 leading-relaxed">
                      {question.question}
                    </p>
                  </div>

                  <div className="space-y-3">
                    <label
                      htmlFor="answer-input"
                      className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
                    >
                      Your Answer
                    </label>
                    <Input
                      id="answer-input"
                      type="text"
                      value={userAnswer}
                      onChange={(e) => setUserAnswer(e.target.value)}
                      placeholder="Type your answer here..."
                      className="text-lg py-6"
                      disabled={isRevealed}
                    />
                  </div>

                  <div className="pt-4">
                    <Button
                      onClick={handleReveal}
                      disabled={!userAnswer.trim()}
                      className="w-full py-6 text-lg"
                      size="lg"
                    >
                      Reveal Answer
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="bg-linear-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-2 border-green-200 dark:border-green-800 shadow-xl min-h-100">
              <CardContent className="p-8">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm font-medium text-green-700 dark:text-green-400 mb-2">
                      Question
                    </h3>
                    <p className="text-lg text-zinc-900 dark:text-zinc-50 leading-relaxed mb-4">
                      {question.question}
                    </p>
                  </div>

                  <div className="bg-white dark:bg-zinc-800 rounded-lg p-4 border-2 border-zinc-200 dark:border-zinc-700">
                    <h3 className="text-sm font-medium text-zinc-500 dark:text-zinc-400 mb-2">
                      Your Answer
                    </h3>
                    <p className="text-lg text-zinc-900 dark:text-zinc-50">
                      {userAnswer}
                    </p>
                  </div>

                  <div className="bg-green-100 dark:bg-green-900/40 rounded-lg p-6 border-2 border-green-300 dark:border-green-700">
                    <h3 className="text-sm font-semibold text-green-800 dark:text-green-300 mb-2 flex items-center gap-2">
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      Correct Answer
                    </h3>
                    <p className="text-2xl font-bold text-green-900 dark:text-green-100">
                      {question.answer}
                    </p>
                  </div>

                  <div className="pt-4">
                    <Button
                      onClick={handleNext}
                      className="w-full py-6 text-lg bg-green-600 hover:bg-green-700"
                      size="lg"
                    >
                      {isLastQuestion ? 'Finish' : 'Next Question →'}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
