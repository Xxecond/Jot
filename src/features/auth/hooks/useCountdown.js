"use client"

import { useState, useRef, useEffect } from 'react'

export default function useCountdown(initial = 60) {
  const [countdown, setCountdown] = useState(0)
  const timerRef = useRef(null)

  const startCountdown = () => {
    setCountdown(initial)

    timerRef.current = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current)
          return 0
        }

        return prev - 1
      })
    }, 1000)
  }

  useEffect(() => {
    return () => clearInterval(timerRef.current)
  }, [])

  return {
    countdown,
    startCountdown,
    canResend: countdown === 0
  }
}