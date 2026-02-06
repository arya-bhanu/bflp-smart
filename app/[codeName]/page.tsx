'use client'

import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export default function CodeNamePage() {
  const params = useParams()
  const router = useRouter()
  const codeName = params.codeName as string

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
        
        <h1 className="text-3xl font-bold mb-8 text-zinc-900 dark:text-zinc-50">
          Code Name: {decodeURIComponent(codeName)}
        </h1>
        
        <div className="bg-white dark:bg-zinc-800 rounded-lg p-6 shadow-sm">
          <p className="text-zinc-600 dark:text-zinc-400">
            This is the page for code name: <span className="font-semibold">{decodeURIComponent(codeName)}</span>
          </p>
          <p className="text-zinc-600 dark:text-zinc-400 mt-4">
            You can now add content specific to this code name here.
          </p>
        </div>
      </div>
    </div>
  )
}
