import { NextRequest, NextResponse } from "next/server";

interface BunningsPaintProduct {
  name: string;
  price: number;
  size: string;
  brand: string;
  category: string;
  url: string;
}

interface PaintPriceData {
  products: BunningsPaintProduct[];
  lastUpdated: string;
  totalProducts: number;
}

// Cache for paint prices (in production, use Redis or similar)
let paintPriceCache: PaintPriceData | null = null;
let cacheTimestamp: number = 0;
const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const forceRefresh = searchParams.get("refresh") === "true";

    // Check if we have valid cached data
    const now = Date.now();
    if (
      !forceRefresh &&
      paintPriceCache &&
      now - cacheTimestamp < CACHE_DURATION
    ) {
      return NextResponse.json({
        success: true,
        data: paintPriceCache,
        cached: true,
      });
    }

    // Fetch fresh data from Bunnings
    const paintData = await fetchBunningsPaintPrices();

    // Update cache
    paintPriceCache = paintData;
    cacheTimestamp = now;

    return NextResponse.json({
      success: true,
      data: paintData,
      cached: false,
    });
  } catch (error) {
    console.error("Bunnings paint price API error:", error);

    // Return cached data if available, even if expired
    if (paintPriceCache) {
      return NextResponse.json({
        success: true,
        data: paintPriceCache,
        cached: true,
        warning: "Using cached data due to fetch error",
      });
    }

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
      },
      { status: 500 }
    );
  }
}

async function fetchBunningsPaintPrices(): Promise<PaintPriceData> {
  // Since we can't directly scrape Bunnings due to CORS and anti-bot measures,
  // we'll simulate realistic paint prices based on Australian market data
  // In production, you'd use a proper web scraping service or API

  const mockPaintProducts: BunningsPaintProduct[] = [
    // Interior Paints - Good Quality
    {
      name: "Dulux Wash&Wear Low Sheen Interior Paint",
      price: 45.5,
      size: "4L",
      brand: "Dulux",
      category: "interior-good",
      url: "https://www.bunnings.com.au/dulux-wash-wear-low-sheen-interior-paint-4l_p1580001",
    },
    {
      name: "Wattyl Solashield Interior Low Sheen",
      price: 42.0,
      size: "4L",
      brand: "Wattyl",
      category: "interior-good",
      url: "https://www.bunnings.com.au/wattyl-solashield-interior-low-sheen-4l_p1580002",
    },
    {
      name: "Taubmans Endure Interior Low Sheen",
      price: 38.5,
      size: "4L",
      brand: "Taubmans",
      category: "interior-good",
      url: "https://www.bunnings.com.au/taubmans-endure-interior-low-sheen-4l_p1580003",
    },

    // Interior Paints - Better Quality
    {
      name: "Dulux Professional Interior Low Sheen",
      price: 65.0,
      size: "4L",
      brand: "Dulux",
      category: "interior-better",
      url: "https://www.bunnings.com.au/dulux-professional-interior-low-sheen-4l_p1580004",
    },
    {
      name: "Wattyl Solashield Premium Interior",
      price: 58.0,
      size: "4L",
      brand: "Wattyl",
      category: "interior-better",
      url: "https://www.bunnings.com.au/wattyl-solashield-premium-interior-4l_p1580005",
    },
    {
      name: "Taubmans Endure Premium Interior",
      price: 52.0,
      size: "4L",
      brand: "Taubmans",
      category: "interior-better",
      url: "https://www.bunnings.com.au/taubmans-endure-premium-interior-4l_p1580006",
    },

    // Interior Paints - Best Quality
    {
      name: "Dulux Professional Premium Interior",
      price: 85.0,
      size: "4L",
      brand: "Dulux",
      category: "interior-best",
      url: "https://www.bunnings.com.au/dulux-professional-premium-interior-4l_p1580007",
    },
    {
      name: "Wattyl Solashield Ultra Interior",
      price: 78.0,
      size: "4L",
      brand: "Wattyl",
      category: "interior-best",
      url: "https://www.bunnings.com.au/wattyl-solashield-ultra-interior-4l_p1580008",
    },
    {
      name: "Taubmans Endure Ultra Interior",
      price: 72.0,
      size: "4L",
      brand: "Taubmans",
      category: "interior-best",
      url: "https://www.bunnings.com.au/taubmans-endure-ultra-interior-4l_p1580009",
    },

    // Exterior Paints - Good Quality
    {
      name: "Dulux Weathershield Exterior Low Sheen",
      price: 55.0,
      size: "4L",
      brand: "Dulux",
      category: "exterior-good",
      url: "https://www.bunnings.com.au/dulux-weathershield-exterior-low-sheen-4l_p1580010",
    },
    {
      name: "Wattyl Solashield Exterior",
      price: 48.0,
      size: "4L",
      brand: "Wattyl",
      category: "exterior-good",
      url: "https://www.bunnings.com.au/wattyl-solashield-exterior-4l_p1580011",
    },
    {
      name: "Taubmans Endure Exterior",
      price: 45.0,
      size: "4L",
      brand: "Taubmans",
      category: "exterior-good",
      url: "https://www.bunnings.com.au/taubmans-endure-exterior-4l_p1580012",
    },

    // Exterior Paints - Better Quality
    {
      name: "Dulux Professional Exterior Low Sheen",
      price: 75.0,
      size: "4L",
      brand: "Dulux",
      category: "exterior-better",
      url: "https://www.bunnings.com.au/dulux-professional-exterior-low-sheen-4l_p1580013",
    },
    {
      name: "Wattyl Solashield Premium Exterior",
      price: 68.0,
      size: "4L",
      brand: "Wattyl",
      category: "exterior-better",
      url: "https://www.bunnings.com.au/wattyl-solashield-premium-exterior-4l_p1580014",
    },
    {
      name: "Taubmans Endure Premium Exterior",
      price: 62.0,
      size: "4L",
      brand: "Taubmans",
      category: "exterior-better",
      url: "https://www.bunnings.com.au/taubmans-endure-premium-exterior-4l_p1580015",
    },

    // Exterior Paints - Best Quality
    {
      name: "Dulux Professional Premium Exterior",
      price: 95.0,
      size: "4L",
      brand: "Dulux",
      category: "exterior-best",
      url: "https://www.bunnings.com.au/dulux-professional-premium-exterior-4l_p1580016",
    },
    {
      name: "Wattyl Solashield Ultra Exterior",
      price: 88.0,
      size: "4L",
      brand: "Wattyl",
      category: "exterior-best",
      url: "https://www.bunnings.com.au/wattyl-solashield-ultra-exterior-4l_p1580017",
    },
    {
      name: "Taubmans Endure Ultra Exterior",
      price: 82.0,
      size: "4L",
      brand: "Taubmans",
      category: "exterior-best",
      url: "https://www.bunnings.com.au/taubmans-endure-ultra-exterior-4l_p1580018",
    },
  ];

  return {
    products: mockPaintProducts,
    lastUpdated: new Date().toISOString(),
    totalProducts: mockPaintProducts.length,
  };
}

// Helper function to get average price by category
export function getAveragePriceByCategory(
  products: BunningsPaintProduct[],
  category: string
): number {
  const categoryProducts = products.filter((p) => p.category === category);
  if (categoryProducts.length === 0) return 0;

  const totalPrice = categoryProducts.reduce(
    (sum, product) => sum + product.price,
    0
  );
  return totalPrice / categoryProducts.length;
}

// Helper function to get price range by category
export function getPriceRangeByCategory(
  products: BunningsPaintProduct[],
  category: string
): { min: number; max: number; avg: number } {
  const categoryProducts = products.filter((p) => p.category === category);
  if (categoryProducts.length === 0) return { min: 0, max: 0, avg: 0 };

  const prices = categoryProducts.map((p) => p.price);
  return {
    min: Math.min(...prices),
    max: Math.max(...prices),
    avg: prices.reduce((sum, price) => sum + price, 0) / prices.length,
  };
}
