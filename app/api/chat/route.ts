import { streamText } from "ai";
import { openai } from "@ai-sdk/openai";
import { NextRequest } from "next/server";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: NextRequest) {
  try {
    const {
      messages,
      model = "gpt-4o-mini",
      temperature = 0.7,
    } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return new Response(
        JSON.stringify({ error: "Messages array is required" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Validate that we have at least one message
    if (messages.length === 0) {
      return new Response(
        JSON.stringify({ error: "At least one message is required" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Stream the AI response using Vercel AI SDK
    const result = streamText({
      model: openai(model),
      messages,
      temperature,
    });

    // Return the streamed response
    return result.toTextStreamResponse({
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    console.error("AI chat API error:", error);

    return new Response(
      JSON.stringify({
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}

// Optional: Add a GET endpoint for testing
export async function GET() {
  return new Response(
    JSON.stringify({
      message: "AI Chat API is running",
      usage:
        'Send POST requests with { messages: [{ role: "user", content: "your message" }] }',
    }),
    {
      status: 200,
      headers: { "Content-Type": "application/json" },
    }
  );
}
