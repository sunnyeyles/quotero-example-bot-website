import { AIChatDemo } from "@/components/ai-chat-demo";

export default function AIDemoPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold">AI Integration Demo</h1>
          <p className="text-xl text-muted-foreground">
            This page demonstrates the Vercel AI SDK integration with OpenAI
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Features</h2>
            <ul className="space-y-2 text-muted-foreground">
              <li>• Streaming AI responses using Vercel AI SDK</li>
              <li>• Real-time message updates</li>
              <li>• Error handling and loading states</li>
              <li>• Configurable model parameters</li>
              <li>• TypeScript support</li>
              <li>• Modern React hooks pattern</li>
            </ul>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Usage</h2>
            <div className="space-y-2 text-muted-foreground">
              <p>
                1. Make sure your{" "}
                <code className="bg-muted px-2 py-1 rounded">
                  OPENAI_API_KEY
                </code>{" "}
                is set in{" "}
                <code className="bg-muted px-2 py-1 rounded">.env.local</code>
              </p>
              <p>2. Type a message in the chat below</p>
              <p>3. Watch the AI response stream in real-time</p>
              <p>4. Try different prompts to test the AI capabilities</p>
            </div>
          </div>
        </div>

        <AIChatDemo />
      </div>
    </div>
  );
}
