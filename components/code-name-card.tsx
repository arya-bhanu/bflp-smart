'use client'

import { useRouter } from "next/navigation"
import { Card, CardHeader, CardTitle } from "@/components/ui/card"

interface CodeNameCardProps {
  codeName: string
}

export function CodeNameCard({ codeName }: CodeNameCardProps) {
  const router = useRouter()

  const handleCardClick = () => {
    router.push(`/${codeName}`)
  }

  return (
    <Card
      className="cursor-pointer transition-all hover:shadow-lg hover:scale-105 bg-white dark:bg-zinc-800"
      onClick={handleCardClick}
    >
      <CardHeader>
        <CardTitle className="text-lg text-center text-zinc-900 dark:text-zinc-50">
          {codeName}
        </CardTitle>
      </CardHeader>
    </Card>
  )
}
