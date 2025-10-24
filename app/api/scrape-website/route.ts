import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json();

    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    // Validate URL
    try {
      new URL(url);
    } catch {
      return NextResponse.json(
        { error: "Invalid URL format" },
        { status: 400 }
      );
    }

    // Fetch the website content
    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; BotTraining/1.0)",
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.5",
        "Accept-Encoding": "gzip, deflate",
        Connection: "keep-alive",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const html = await response.text();

    // Basic HTML parsing to extract text content
    const titleMatch = html.match(/<title[^>]*>([^<]*)<\/title>/i);
    const title = titleMatch ? titleMatch[1].trim() : "";

    // Remove script and style elements
    const cleanHtml = html
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
      .replace(/<nav[^>]*>[\s\S]*?<\/nav>/gi, "")
      .replace(/<footer[^>]*>[\s\S]*?<\/footer>/gi, "")
      .replace(/<header[^>]*>[\s\S]*?<\/header>/gi, "");

    // Extract text content from main content areas
    const contentSelectors = [
      "main",
      "article",
      ".content",
      ".main-content",
      "#content",
      ".post-content",
      ".entry-content",
    ];

    let content = "";
    for (const selector of contentSelectors) {
      const regex = new RegExp(
        `<${selector}[^>]*>([\\s\\S]*?)<\\/${selector}>`,
        "gi"
      );
      const matches = cleanHtml.match(regex);
      if (matches) {
        content = matches.join(" ");
        break;
      }
    }

    // If no specific content area found, extract from body
    if (!content) {
      const bodyMatch = cleanHtml.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
      if (bodyMatch) {
        content = bodyMatch[1];
      }
    }

    // Clean up the content
    content = content
      .replace(/<[^>]*>/g, " ") // Remove HTML tags
      .replace(/\s+/g, " ") // Normalize whitespace
      .replace(/&nbsp;/g, " ") // Replace HTML entities
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .trim();

    // Extract links
    const linkMatches = html.match(
      /<a[^>]*href=["']([^"']*)["'][^>]*>([^<]*)<\/a>/gi
    );
    const links: string[] = [];
    if (linkMatches) {
      linkMatches.forEach((link) => {
        const hrefMatch = link.match(/href=["']([^"']*)["']/i);
        const textMatch = link.match(/>([^<]*)</i);
        if (hrefMatch && textMatch) {
          const href = hrefMatch[1];
          const text = textMatch[1].trim();
          if (
            href &&
            text &&
            !href.startsWith("#") &&
            !href.startsWith("javascript:")
          ) {
            // Convert relative URLs to absolute
            const absoluteUrl = href.startsWith("http")
              ? href
              : new URL(href, url).href;
            links.push(`${text}: ${absoluteUrl}`);
          }
        }
      });
    }

    return NextResponse.json({
      title,
      content: content.substring(0, 10000), // Limit content length
      links: links.slice(0, 20), // Limit number of links
    });
  } catch (error) {
    console.error("Scraping error:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
      },
      { status: 500 }
    );
  }
}
