import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { websiteData } = await request.json();

    if (!websiteData) {
      return NextResponse.json(
        { error: "Website data is required" },
        { status: 400 }
      );
    }

    // Create a system prompt for business analysis
    const systemPrompt = `You are creating training content for an AI chatbot. Analyze the website data and write directly as if you're telling the chatbot about the business it works for.

Write in second person ("You work for...", "Your business...") and be conversational. Include:
- What the business does and offers
- Who their customers are
- Key services and value propositions
- Common customer questions
- Contact information

Do NOT include any meta-commentary like "I have analyzed" or "Here is a detailed business profile". Write directly as training content for the bot.

Use British English spelling and Australian business context.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: systemPrompt },
        {
          role: "user",
          content: `Create training content for a chatbot based on this website data:\n\n${websiteData}`,
        },
      ],
      max_tokens: 1000,
      temperature: 0.7,
    });

    const analysis =
      completion.choices[0]?.message?.content ||
      "Unable to analyze business data.";

    return NextResponse.json({
      businessAnalysis: analysis,
      success: true,
    });
  } catch (error) {
    console.error("Business analysis API error:", error);

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
