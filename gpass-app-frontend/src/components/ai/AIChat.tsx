import { useRef, useEffect } from 'react'
import { useGemini } from '@/hooks/ai/useGemini'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import LoadingSpinner from '@/components/shared/LoadingSpinner'
import { toast } from 'sonner'
import { Send, Trash2, AlertCircle } from 'lucide-react'

interface AIChatProps {
  className?: string
}

/**
 * AI Chat komponens a Gemini API-val
 * Teljes beszélgetési funkcionalitás előzménnyel
 */
export function AIChat({ className = '' }: AIChatProps) {
  const { response, loading, error, sendMessage, conversationHistory, clearHistory, resetError } =
    useGemini()

  const inputRef = useRef<HTMLInputElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  // Auto-scroll az utolsó üzenethez
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [conversationHistory, loading])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()

    const userInput = inputRef.current?.value.trim()
    if (!userInput || !inputRef.current) return

    inputRef.current.value = ''

    const result = await sendMessage(userInput)
    if (!result && error) {
      toast.error(error.message)
    }
  }

  const handleClearHistory = () => {
    clearHistory()
    toast.success('Beszélgetés előzménye törölve')
  }

  return (
    <div className={`flex flex-col h-full gap-4 ${className}`}>
      <Card className="flex-1 flex flex-col bg-card">
        <CardHeader className="border-b">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <span className="text-lg">🤖</span>
              Gemini AI Asszisztens
            </CardTitle>
            {conversationHistory.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearHistory}
                disabled={loading}
                title="Beszélgetés törlése"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        </CardHeader>

        {/* Chat Messages */}
        <CardContent className="flex-1 overflow-y-auto p-4 space-y-4" ref={scrollRef}>
          {error && (
            <div className="bg-destructive/10 border border-destructive/50 rounded-lg p-4 flex gap-3">
              <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-semibold text-destructive text-sm">Hiba!</p>
                <p className="text-xs text-destructive/80 mt-1">{error.message}</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={resetError}
                className="text-destructive hover:text-destructive"
              >
                ✕
              </Button>
            </div>
          )}

          {conversationHistory.length === 0 && !loading && (
            <div className="h-full flex items-center justify-center text-center">
              <div className="text-muted-foreground">
                <div className="text-3xl mb-2">💬</div>
                <p className="text-sm font-medium">Kezdj el egy beszélgetést!</p>
                <p className="text-xs mt-1 opacity-75">Írj egy kérdést vagy üzenetet az alul</p>
              </div>
            </div>
          )}

          {conversationHistory.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-3 rounded-lg text-sm ${
                  msg.role === 'user'
                    ? 'bg-primary text-primary-foreground rounded-br-none'
                    : 'bg-muted text-muted-foreground border border-border rounded-bl-none'
                }`}
              >
                <p className="whitespace-pre-wrap leading-relaxed">{msg.parts[0].text}</p>
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="bg-muted border border-border px-4 py-3 rounded-lg rounded-bl-none flex items-center gap-2">
                <LoadingSpinner className="w-4 h-4" />
                <span className="text-sm text-muted-foreground">Gondolkodás...</span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Input Area */}
      <form onSubmit={handleSendMessage} className="flex gap-2">
        <Input
          ref={inputRef}
          placeholder="Írj egy kérdést vagy üzenetet..."
          disabled={loading}
          maxLength={500}
          className="flex-1"
        />
        <Button
          type="submit"
          disabled={loading}
          size="icon"
          title="Üzenet küldése"
        >
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </div>
  )
}

export default AIChat
