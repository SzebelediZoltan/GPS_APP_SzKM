import { useRef, useEffect } from 'react'
import { useOpenRouter } from '@/hooks/ai/useOpenRouter'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import LoadingSpinner from '@/components/shared/LoadingSpinner'
import { toast } from 'sonner'
import { Send, Trash2, AlertCircle } from 'lucide-react'

interface AIChatProps {
  className?: string
}

export function AIChat({ className = '' }: AIChatProps) {
  const { loading, error, sendMessage, conversationHistory, clearHistory } =
    useOpenRouter()

  const inputRef = useRef<HTMLInputElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

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
              AI Asszisztens
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

        <CardContent className="flex-1 overflow-y-auto p-4 space-y-4" ref={scrollRef}>
          {error && (
            <div className="bg-destructive/10 border border-destructive/50 rounded-lg p-4 flex gap-3">
              <AlertCircle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
              <p className="text-sm text-destructive">{error.message}</p>
            </div>
          )}

          {conversationHistory.length === 0 && !loading && (
            <div className="flex flex-col items-center justify-center h-full text-center gap-2 py-8">
              <span className="text-4xl">🤖</span>
              <p className="text-muted-foreground text-sm">Kérdezz bármit az útvonaladról vagy a forgalomról!</p>
            </div>
          )}

          {conversationHistory.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm ${
                msg.role === 'user'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-foreground'
              }`}>
                {msg.content}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="bg-muted rounded-2xl px-4 py-2.5">
                <LoadingSpinner />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <form onSubmit={handleSendMessage} className="flex gap-2">
        <Input
          ref={inputRef}
          placeholder="Írj üzenetet..."
          disabled={loading}
          className="flex-1 rounded-xl"
        />
        <Button type="submit" disabled={loading} className="rounded-xl cursor-pointer">
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </div>
  )
}

export default AIChat
