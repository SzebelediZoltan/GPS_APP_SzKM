import { useState, useCallback } from 'react'
import { useMutation } from '@tanstack/react-query'

export type ConversationMessage = {
  role: 'user' | 'model'
  parts: Array<{ text: string }>
}

export type UseGeminiOptions = {
  modelName?: string
}

export type UseGeminiReturn = {
  response: string
  loading: boolean
  error: Error | null
  sendMessage: (userMessage: string) => Promise<string | null>
  conversationHistory: ConversationMessage[]
  clearHistory: () => void
  resetError: () => void
}

/**
 * Custom React hook a Google Gemini API-hoz
 * Kulcs: https://aistudio.google.com/app/apikey
 * .env.local: VITE_GEMINI_API_KEY=...
 */
export function useGemini(options: UseGeminiOptions = {}): UseGeminiReturn {
  const { modelName = 'gemini-3-flash-preview' } = options

  const [response, setResponse] = useState<string>('')
  const [error, setError] = useState<Error | null>(null)
  const [conversationHistory, setConversationHistory] = useState<ConversationMessage[]>([])

  const { mutateAsync: sendMessageAsync, isPending: loading } = useMutation({
    mutationFn: async (userMessage: string): Promise<string | null> => {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY

      if (!apiKey) {
        throw new Error('Gemini API key nincs beállítva. Add meg a VITE_GEMINI_API_KEY-t a .env.local fájlban!')
      }

      try {
        const { GoogleGenerativeAI } = await import('@google/generative-ai')
        const genAI = new GoogleGenerativeAI(apiKey)
        const model = genAI.getGenerativeModel({ model: modelName })

        const chat = model.startChat({ history: conversationHistory })
        const result = await chat.sendMessage(userMessage)
        return result.response.text()
      } catch (err) {
        throw new Error(`Gemini API hiba: ${err instanceof Error ? err.message : String(err)}`)
      }
    },
    onSuccess: (aiResponse) => {
      if (!aiResponse) return
      setResponse(aiResponse)
      setConversationHistory((prev) => [...prev, { role: 'model', parts: [{ text: aiResponse }] }])
      setError(null)
    },
    onError: (err) => {
      const errorObj = err instanceof Error ? err : new Error(String(err))
      setError(errorObj)
      console.error('Gemini API hiba:', errorObj)
    },
  })

  const sendMessage = useCallback(
    async (userMessage: string): Promise<string | null> => {
      setConversationHistory((prev) => [...prev, { role: 'user', parts: [{ text: userMessage }] }])
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

  const resetError = useCallback(() => setError(null), [])

  return { response, loading, error, sendMessage, conversationHistory, clearHistory, resetError }
}

export default useGemini
