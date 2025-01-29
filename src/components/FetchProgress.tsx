import { useState, useEffect } from 'react'
import { Progress } from "@/components/ui/shadcn/progress"

interface FetchProgressProps {
  label: string
  duration: number
  onComplete: () => void
}

export function FetchProgress({ label, duration, onComplete }: FetchProgressProps) {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((oldProgress) => {
        if (oldProgress === 100) {
          clearInterval(interval)
          onComplete()
          return 100
        }
        const newProgress = oldProgress + 100 / (duration / 100)
        return Math.min(newProgress, 100)
      })
    }, 100)

    return () => clearInterval(interval)
  }, [duration, onComplete])

  return (
    <div className="mb-4">
      <div className="flex justify-between mb-1">
        <span className="text-sm font-medium text-gray-700">{label}</span>
        <span className="text-sm font-medium text-gray-700">{Math.round(progress)}%</span>
      </div>
      <Progress value={progress} className="w-full" />
    </div>
  )
}

