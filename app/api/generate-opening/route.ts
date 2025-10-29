import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { botName, botPersonality, trainingData } = await request.json();

    if (!botName || !botPersonality) {
      return NextResponse.json(
        { error: "Bot name and personality are required" },
        { status: 400 }
      );
    }

    // Create personality-based system prompt
    const personalityConfig = {
      name: botName,
      personality: botPersonality,
      tone: botPersonality,
      behaviour: botPersonality,
    };

    const systemPrompt = `You are creating an opening message for an AI chatbot with the following configuration:

CONFIGURATION:
${JSON.stringify(personalityConfig, null, 2)}

CRITICAL INSTRUCTIONS:
- The opening message MUST match the personality, tone, and behaviour specified above exactly
- If the personality is "rude and vague", create a rude and vague opening message
- If the personality is "friendly and helpful", create a friendly and helpful opening message
- If the personality is "professional and formal", create a professional and formal opening message
- The personality configuration overrides all other instructions

The opening message should:
- Be 1-2 sentences maximum
- Match the personality exactly
- Introduce the bot with their name
- Use British English spelling
- Be specific to the business context

Format: Generate only the opening message text, no additional formatting or explanations.`;

    const userPrompt = `Generate an opening message for a chatbot:

Bot Name: ${botName}
Bot Personality: ${botPersonality}

Business Info: ${trainingData || "No specific training data provided"}

Create an opening message that matches the personality exactly. If the personality is "rude and vague", make it rude and vague. If it's "friendly and helpful", make it friendly and helpful.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      max_tokens: 80,
      temperature: 0.7,
    });

    const openingMessage =
      completion.choices[0]?.message?.content ||
      generateFallbackOpening(botName, botPersonality);

    // Fallback opening message generator based on personality
    function generateFallbackOpening(
      name: string,
      personality: string
    ): string {
      const lowerPersonality = personality.toLowerCase();

      if (
        lowerPersonality.includes("rude") ||
        lowerPersonality.includes("vague")
      ) {
        return `Yeah, I'm ${name}. What do you want?`;
      } else if (
        lowerPersonality.includes("friendly") ||
        lowerPersonality.includes("helpful")
      ) {
        return `Hi there! I'm ${name} and I'm here to help you with whatever you need. How can I assist you today?`;
      } else if (
        lowerPersonality.includes("professional") ||
        lowerPersonality.includes("formal")
      ) {
        return `Good day. I am ${name}, your professional assistant. How may I be of service?`;
      } else {
        return `Hello! I'm ${name} from this business. I'm here to help you with your needs. How can I assist you today?`;
      }
    }

    return NextResponse.json({
      openingMessage: openingMessage.trim(),
      success: true,
    });
  } catch (error) {
    console.error("Opening message generation API error:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
        success: false,
      },
      { status: 500 }
    );
  }
}
