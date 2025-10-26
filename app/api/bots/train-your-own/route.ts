import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { ChatRequest, ChatResponse } from "@/lib/types";
import { BOT_CONFIGURATION_TRAINING_DATA } from "@/lib/bot-config-training";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const body: ChatRequest = await request.json();
    const { message, botData, conversationHistory } = body;

    if (!message || !botData) {
      return NextResponse.json(
        { error: "Message and bot data are required" },
        { status: 400 }
      );
    }

    // Create structured personality configuration
    const personalityConfig = {
      name: botData.name,
      personality: botData.personality || "helpful and professional",
      tone: botData.personality || "helpful and professional",
      behavior: botData.personality || "helpful and professional",
    };

    const systemPrompt = `You are an AI assistant with the following configuration:

CONFIGURATION:
${JSON.stringify(personalityConfig, null, 2)}

TRAINING DATA:
${botData.trainingData}

${BOT_CONFIGURATION_TRAINING_DATA}

CRITICAL INSTRUCTIONS:
- You MUST follow the personality, tone, and behavior specified in the CONFIGURATION section exactly
- Your responses should match the personality and tone defined above
- If the personality is "rude and vague", respond rudely and vaguely
- If the personality is "friendly and helpful", respond in a friendly and helpful manner
- The personality configuration overrides all other instructions

You should also:
- Be familiar with Australian business regulations, tax systems, and market conditions
- Use British English
- Reference relevant Australian business resources when appropriate
- Keep responses concise but informative

Remember: Your personality and tone must match the CONFIGURATION section above.`;

    // Prepare conversation history for OpenAI
    const messages = [
      { role: "system" as const, content: systemPrompt },
      ...conversationHistory.map((msg) => ({
        role: msg.role,
        content: msg.content,
      })),
      { role: "user" as const, content: message },
    ];

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages,
      max_tokens: 500,
      temperature: 0.7,
    });

    const response: ChatResponse = {
      message:
        completion.choices[0]?.message?.content ||
        "Sorry, I could not generate a response.",
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Chat API error:", error);

    const response: ChatResponse = {
      message: "Sorry, there was an error processing your request.",
      error: error instanceof Error ? error.message : "Unknown error",
    };

    return NextResponse.json(response, { status: 500 });
  }
}
