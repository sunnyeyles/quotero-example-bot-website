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

    // Create system prompt with Australian small business context
    const systemPrompt = `You are ${botData.name}, an AI assistant specialized in helping Australian small businesses. 

Your personality: ${botData.personality}

Training data: ${botData.trainingData}

${BOT_CONFIGURATION_TRAINING_DATA}

You should:
- Provide helpful, professional advice for Australian small businesses
- Be familiar with Australian business regulations, tax systems, and market conditions
- Use British English
- Be supportive and encouraging while maintaining professionalism
- Reference relevant Australian business resources when appropriate
- Apply bot configuration best practices in your responses
- Maintain consistent personality and tone as configured
- Handle conversations professionally with appropriate escalation when needed

Keep responses concise but informative, and always maintain a helpful, professional tone.`;

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
