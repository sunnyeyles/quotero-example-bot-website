# AI Integration with Vercel AI SDK

This project now includes AI functionality using the Vercel AI SDK and OpenAI. Here's how to set it up and use it.

## Setup

### 1. Environment Variables

Create a `.env.local` file in your project root with your OpenAI API key:

```bash
OPENAI_API_KEY=your_openai_api_key_here
```

You can get an API key from [OpenAI Platform](https://platform.openai.com/api-keys).

### 2. Dependencies

The following packages have been installed:

- `ai` - Vercel AI SDK for streaming AI responses
- `@ai-sdk/openai` - OpenAI provider for the AI SDK

## Usage

### API Endpoint

The main AI endpoint is available at `/api/chat` and supports:

- **POST**: Send messages to get AI responses
- **GET**: Check if the API is running

#### Example API Usage

```typescript
// Send a message
const response = await fetch("/api/chat", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    messages: [{ role: "user", content: "Hello, how are you?" }],
    model: "gpt-4o-mini", // optional
    temperature: 0.7, // optional
    maxTokens: 1000, // optional
  }),
});

// Handle streaming response
const reader = response.body?.getReader();
// ... process stream
```

### React Hook

Use the `useAIChat` hook for easy integration:

```typescript
import { useAIChat } from "@/hooks/useAIChat";

function MyComponent() {
  const { messages, isLoading, sendMessage, clearMessages } = useAIChat({
    model: "gpt-4o-mini",
    temperature: 0.7,
    onError: (error) => console.error(error),
    onFinish: (content) => console.log("Response:", content),
  });

  return (
    <div>
      {messages.map((msg, i) => (
        <div key={i}>
          {msg.role}: {msg.content}
        </div>
      ))}
      <button onClick={() => sendMessage("Hello!")}>Send Message</button>
    </div>
  );
}
```

### Demo Page

Visit `/ai-demo` to see a complete working example of the AI chat functionality.

## Features

- ✅ **Streaming Responses**: Real-time AI responses using Vercel AI SDK
- ✅ **TypeScript Support**: Full type safety
- ✅ **Error Handling**: Comprehensive error management
- ✅ **Loading States**: Built-in loading indicators
- ✅ **Configurable**: Customizable model parameters
- ✅ **Modern React**: Uses hooks and modern patterns

## Available Models

You can use any OpenAI model available through the API:

- `gpt-4o-mini` (default, cost-effective)
- `gpt-4o`
- `gpt-4-turbo`
- `gpt-3.5-turbo`

## Configuration Options

- `model`: OpenAI model to use
- `temperature`: Controls randomness (0-2)
- `maxTokens`: Maximum tokens in response
- `onError`: Error callback function
- `onFinish`: Completion callback function

## Troubleshooting

1. **API Key Issues**: Make sure `OPENAI_API_KEY` is set in `.env.local`
2. **CORS Issues**: The API endpoint handles CORS automatically
3. **Streaming Issues**: Check browser compatibility for streaming responses
4. **Rate Limits**: OpenAI has rate limits - check your usage

## Next Steps

- Add conversation memory/persistence
- Implement custom system prompts
- Add file upload capabilities
- Integrate with your existing bot training system
