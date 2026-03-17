import { useState, useCallback } from 'react'
import { useMutation } from '@tanstack/react-query'

export type ConversationMessage = {
  role: 'user' | 'assistant'
  content: string
}

export type UseOpenRouterReturn = {
  response: string
  loading: boolean
  error: Error | null
  sendMessage: (userMessage: string) => Promise<string | null>
  conversationHistory: ConversationMessage[]
  clearHistory: () => void
  resetError: () => void
}

/**
 * Custom React hook az OpenRouter API-hoz
 *
 * Szükséges:
 * - .env.local fájl VITE_OPENROUTER_API_KEY=your-api-key-here-vel
 *
 * Kulcs: https://openrouter.ai/keys
 */
export function useOpenRouter(): UseOpenRouterReturn {
  const [response, setResponse] = useState<string>('')
  const [error, setError] = useState<Error | null>(null)
  const [conversationHistory, setConversationHistory] = useState<ConversationMessage[]>([])

  const { mutateAsync: sendMessageAsync, isPending: loading } = useMutation({
    mutationFn: async (userMessage: string): Promise<string | null> => {
      const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY

      if (!apiKey) {
        throw new Error(
          'OpenRouter API key nincs beállítva. Add meg a VITE_OPENROUTER_API_KEY-t a .env.local fájlban!'
        )
      }

      const messages: ConversationMessage[] = [
        ...conversationHistory,
        { role: 'user', content: userMessage },
      ]

      const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
          'HTTP-Referer': window.location.origin,
          'X-Title': 'GPASS App',
        },
        body: JSON.stringify({
          model: 'google/gemini-2.5-flash-lite',
          max_tokens: 1024,
          messages,
        }),
      })

      if (!res.ok) {
        const errBody = await res.json().catch(() => ({}))
        throw new Error(`OpenRouter API hiba: ${res.status} – ${errBody?.error?.message ?? res.statusText}`)
      }

      const data = await res.json()
      const aiResponse = data.choices?.[0]?.message?.content ?? null

      if (!aiResponse) throw new Error('Az AI nem küldött választ')

      return aiResponse
    },
    onSuccess: (aiResponse) => {
      if (!aiResponse) return
      setResponse(aiResponse)
      setConversationHistory((prev) => [
        ...prev,
        { role: 'assistant', content: aiResponse },
      ])
      setError(null)
    },
    onError: (err) => {
      const errorObj = err instanceof Error ? err : new Error(String(err))
      setError(errorObj)
      console.error('OpenRouter API hiba:', errorObj)
    },
  })

  const sendMessage = useCallback(
    async (userMessage: string): Promise<string | null> => {
      setConversationHistory((prev) => [
        ...prev,
        { role: 'user', content: userMessage },
      ])
      try {
        return await sendMessageAsync(userMessage)
      } catch {
        return null
      }
    },
    [sendMessageAsync]
  )

  const clearHistory = useCallback(() => {
    setConversationHistory([])
    setResponse('')
    setError(null)
  }, [])

  const resetError = useCallback(() => {
    setError(null)
  }, [])

  return {
    response,
    loading,
    error,
    sendMessage,
    conversationHistory,
    clearHistory,
    resetError,
  }
}

export default useOpenRouter
