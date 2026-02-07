import { createClient } from "@/lib/supabase/server"
import { CodeNameCard } from "@/components/code-name-card"
import { SessionRedirect } from "@/components/session-redirect"

interface CodeNameResult {
  code_name: string
}

export default async function Home() {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('soal')
    .select('code_name')
    .order('code_name')

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-zinc-900">
        <p className="text-lg text-red-600 dark:text-red-400">Error: {error.message}</p>
      </div>
    )
  }

  const distinctCodeNames = Array.from(
    new Set(data?.map((item: CodeNameResult) => item.code_name) || [])
  )

  return (
    <>
      <SessionRedirect />
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-center mb-8 text-zinc-900 dark:text-zinc-50">
            Select Code Name
          </h1>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {distinctCodeNames.map((codeName) => (
              <CodeNameCard key={codeName} codeName={codeName} />
            ))}
          </div>

          {distinctCodeNames.length === 0 && (
            <p className="text-center text-zinc-600 dark:text-zinc-400 mt-8">
              No code names found.
            </p>
          )}
        </div>
      </div>
    </>
  )
}
