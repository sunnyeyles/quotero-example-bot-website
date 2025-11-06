import { Resend } from "resend";
import { NextRequest, NextResponse } from "next/server";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  try {
    const { name, email, phone, availability, message } = await req.json();

    // Validate required fields
    if (!name || !email) {
      return NextResponse.json(
        { error: "Name and email are required" },
        { status: 400 }
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email address" },
        { status: 400 }
      );
    }

    // If RESEND_API_KEY is not set, just log the email (for development)
    if (!process.env.RESEND_API_KEY) {
      console.log("📧 Email would be sent (RESEND_API_KEY not set):");
      console.log({
        to: process.env.EMAIL_FROM || "your-email@example.com",
        from: email,
        subject: `Contact Form Submission from ${name}`,
        name,
        email,
        phone,
        availability,
        message,
      });
      return NextResponse.json(
        { success: true, message: "Email logged (development mode)" },
        { status: 200 }
      );
    }

    // Get the recipient email (from EMAIL_FROM or use a default)
    const recipientEmail = process.env.EMAIL_FROM || "onboarding@resend.dev";

    // Build email content
    const emailContent = `
      <h2>New Contact Form Submission</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      ${phone ? `<p><strong>Phone:</strong> ${phone}</p>` : ""}
      ${availability ? `<p><strong>Availability:</strong> ${availability}</p>` : ""}
      ${message ? `<p><strong>Message:</strong></p><p>${message.replace(/\n/g, "<br>")}</p>` : ""}
    `;

    // Send email using Resend
    const { data, error } = await resend.emails.send({
      from: recipientEmail,
      to: recipientEmail, // Send to yourself, or you can use a different recipient
      replyTo: email, // Allow replying directly to the user
      subject: `Contact Form Submission from ${name}`,
      html: emailContent,
    });

    if (error) {
      console.error("Resend error:", error);
      return NextResponse.json(
        { error: "Failed to send email" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: true, message: "Email sent successfully", id: data?.id },
      { status: 200 }
    );
  } catch (error) {
    console.error("Contact form API error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
      },
      { status: 500 }
    );
  }
}

