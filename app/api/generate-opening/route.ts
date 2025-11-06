import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { botName, botPersonality, trainingData } = await request.json();

    if (!botPersonality) {
      return NextResponse.json(
        { error: "Bot personality is required" },
        { status: 400 }
      );
    }

    // Use a default name if not provided
    const nameToUse = botName || "your assistant";

    // Create personality-based system prompt
    const personalityConfig = {
      name: nameToUse,
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
- If a bot name is provided, introduce the bot with their name
- If no bot name is provided, focus on the business context from training data
- Use British English spelling
- Be specific to the business context from the training data

Format: Generate only the opening message text, no additional formatting or explanations.`;

    const userPrompt = `Generate an opening message for a chatbot:

${
  botName
    ? `Bot Name: ${botName}`
    : "Bot Name: Not provided (focus on business context)"
}
Bot Personality: ${botPersonality}

Business Info: ${trainingData || "No specific training data provided"}

IMPORTANT: Carefully analyze the training data above to identify:
1. The business name (look for phrases like "Joe's fruit shop", "ABC Plumbing", company names, shop names, etc.)
2. The type of business (e.g., fruit shop, plumbing service, restaurant, store, etc.)
3. Key products/services mentioned

If the training data mentions a specific business name (like "Joe's fruit shop" or "ABC Plumbing"), use that exact name in the opening message.

Create an opening message that:
- If a business name is found in the training data, use it (e.g., "Welcome to Joe's fruit shop, how can I help you?" or "Hello! Welcome to Joe's fruit shop. How can I assist you today?")
- If no specific business name is found but training data exists, create a welcoming message based on the business type and context (e.g., "Hello! Welcome. How can I help you today?" or "Hi there! I'm here to help you with [business type] questions.")
- If a bot name is provided, you may include it, but prioritize the business context from training data
- Matches the personality exactly. If the personality is "rude and vague", make it rude and vague. If it's "friendly and helpful", make it friendly and helpful.
- Is specific to the business context from the training data
- Is 1-2 sentences maximum
- Uses British English spelling

Example: If training data says "Joe's fruit shop sells fresh fruits and vegetables", the opening message should be: "Welcome to Joe's fruit shop, how can I help you?"
Example: If training data says "We offer plumbing services" but no business name, the opening message could be: "Hello! Welcome. How can I help you with your plumbing needs today?"`;

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
      generateFallbackOpening(nameToUse, botPersonality, trainingData);

    // Fallback opening message generator based on personality
    function generateFallbackOpening(
      name: string,
      personality: string,
      trainingData?: string
    ): string {
      const lowerPersonality = personality.toLowerCase();

      // Try to extract business name from training data (simple pattern matching)
      // The AI will do the heavy lifting, this is just a simple fallback
      let businessContext = "";

      if (
        lowerPersonality.includes("rude") ||
        lowerPersonality.includes("vague")
      ) {
        return businessContext
          ? `Yeah, what do you want?`
          : `What do you want?`;
      } else if (
        lowerPersonality.includes("friendly") ||
        lowerPersonality.includes("helpful")
      ) {
        return businessContext
          ? `Hello! Welcome to ${businessContext}. How can I help you today?`
          : `Hello! How can I help you today?`;
      } else if (
        lowerPersonality.includes("professional") ||
        lowerPersonality.includes("formal")
      ) {
        return businessContext
          ? `Good day. Welcome to ${businessContext}. How may I assist you?`
          : `Good day. How may I assist you?`;
      } else {
        return businessContext
          ? `Hello! Welcome to ${businessContext}. How can I help you today?`
          : `Hello! How can I help you today?`;
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
