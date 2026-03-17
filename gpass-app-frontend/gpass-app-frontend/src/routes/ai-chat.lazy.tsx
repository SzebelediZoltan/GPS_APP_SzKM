import { createLazyFileRoute } from '@tanstack/react-router'
import { AIChat } from '@/components/ai/AIChat'

export const Route = createLazyFileRoute('/ai-chat')({
  component: AIChatPage,
})

/**
 * AI Chat oldal
 * A Gemini AI asszisztenst tartalmazza
 */
function AIChatPage() {
  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm p-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🤖</span>
            <div>
              <h1 className="text-2xl font-bold">AI Asszisztens</h1>
              <p className="text-sm text-muted-foreground">Gemini-val működő chatbot</p>
            </div>
          </div>
        </div>
      </header>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col overflow-hidden bg-background">
        <div className="max-w-4xl w-full mx-auto flex flex-col flex-1 p-4">
          <AIChat className="flex-1" />
        </div>
      </div>

      {/* Footer Info */}
      <footer className="border-t bg-card/50 backdrop-blur-sm p-3 text-center text-xs text-muted-foreground">
        <p>
          Ez az AI asszisztens a{' '}
          <a
            href="https://ai.google.dev"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-foreground"
          >
            Google Gemini
          </a>{' '}
          API-t használja
        </p>
      </footer>
    </div>
  )
}
