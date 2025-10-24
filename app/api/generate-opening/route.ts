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

    // Create a system prompt for generating opening messages
    const systemPrompt = `You are an expert at creating short, engaging opening messages for AI chatbots. Your task is to generate a brief, welcoming opening message that:

1. **Introduces the bot** with their name
2. **Mentions the business** they work for (extracted from training data)
3. **Highlights ONE key service** or what the business does
4. **Ends with a simple question**
5. **Uses British English** spelling and Australian business context

The opening message should be:
- Short and sweet (1-2 sentences maximum)
- Conversational and friendly
- Specific to the business (not generic)
- Simple and direct

Format: Generate only the opening message text, no additional formatting or explanations.`;

    const userPrompt = `Generate a short, sweet opening message for a chatbot:

Bot Name: ${botName}
Bot Personality: ${botPersonality}

Business Info: ${trainingData || "No specific training data provided"}

Create a brief, friendly opening message (1-2 sentences) that introduces the bot and mentions what they can help with.`;

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
      `Hello! I'm ${botName} from this business. I'm here to help you with your needs. How can I assist you today?`;

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
