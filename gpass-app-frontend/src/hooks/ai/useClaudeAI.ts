import { useState, useCallback } from 'react'
import { useMutation } from '@tanstack/react-query'

export type ConversationMessage = {
  role: 'user' | 'assistant'
  content: string
}

export type UseClaudeAIReturn = {
  response: string
  loading: boolean
  error: Error | null
  sendMessage: (userMessage: string) => Promise<string | null>
  conversationHistory: ConversationMessage[]
  clearHistory: () => void
  resetError: () => void
}

/**
 * Custom React hook az Anthropic Claude API-hoz
 *
 * Szükséges:
 * - .env.local fájl VITE_ANTHROPIC_API_KEY=your-api-key-here-vel
 *
 * Kulcs: https://console.anthropic.com/settings/keys
 */
export function useClaudeAI(): UseClaudeAIReturn {
  const [response, setResponse] = useState<string>('')
  const [error, setError] = useState<Error | null>(null)
  const [conversationHistory, setConversationHistory] = useState<ConversationMessage[]>([])

  const { mutateAsync: sendMessageAsync, isPending: loading } = useMutation({
    mutationFn: async (userMessage: string): Promise<string | null> => {
      const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY

      if (!apiKey) {
        throw new Error(
          'Anthropic API key nincs beállítva. Add meg a VITE_ANTHROPIC_API_KEY-t a .env.local fájlban!'
        )
      }

      const messages: ConversationMessage[] = [
        ...conversationHistory,
        { role: 'user', content: userMessage },
      ]

      const res = await fetch('/anthropic/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
          'anthropic-dangerous-direct-browser-access': 'true',
        },
        body: JSON.stringify({
          model: 'claude-haiku-4-5-20251001',
          max_tokens: 1024,
          messages,
        }),
      })

      if (!res.ok) {
        const errBody = await res.json().catch(() => ({}))
        throw new Error(`Claude API hiba: ${res.status} – ${errBody?.error?.message ?? res.statusText}`)
      }

      const data = await res.json()
      const aiResponse = data.content?.[0]?.text ?? null

      if (!aiResponse) throw new Error('Claude nem küldött választ')

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
      console.error('Claude API hiba:', errorObj)
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

export default useClaudeAI
