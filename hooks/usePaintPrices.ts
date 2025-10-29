import { useState, useEffect, useCallback } from "react";

export interface BunningsPaintProduct {
  name: string;
  price: number;
  size: string;
  brand: string;
  category: string;
  url: string;
}

export interface PaintPriceData {
  products: BunningsPaintProduct[];
  lastUpdated: string;
  totalProducts: number;
}

export interface PaintPriceResponse {
  success: boolean;
  data?: PaintPriceData;
  cached?: boolean;
  warning?: string;
  error?: string;
}

export interface UsePaintPricesOptions {
  autoFetch?: boolean;
  refreshInterval?: number; // in milliseconds
}

export interface UsePaintPricesReturn {
  paintData: PaintPriceData | null;
  isLoading: boolean;
  error: string | null;
  lastUpdated: string | null;
  isCached: boolean;
  fetchPrices: (forceRefresh?: boolean) => Promise<void>;
  getPriceByCategory: (category: string) => number;
  getPriceRangeByCategory: (category: string) => {
    min: number;
    max: number;
    avg: number;
  };
}

export function usePaintPrices(
  options: UsePaintPricesOptions = {}
): UsePaintPricesReturn {
  const { autoFetch = true, refreshInterval = 30 * 60 * 1000 } = options; // 30 minutes default

  const [paintData, setPaintData] = useState<PaintPriceData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [isCached, setIsCached] = useState(false);

  const fetchPrices = useCallback(async (forceRefresh = false) => {
    setIsLoading(true);
    setError(null);

    try {
      const url = forceRefresh
        ? "/api/bunnings-paint-prices?refresh=true"
        : "/api/bunnings-paint-prices";

      const response = await fetch(url);
      const result: PaintPriceResponse = await response.json();

      if (result.success && result.data) {
        setPaintData(result.data);
        setLastUpdated(result.data.lastUpdated);
        setIsCached(result.cached || false);
      } else {
        setError(result.error || "Failed to fetch paint prices");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error occurred");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getPriceByCategory = useCallback(
    (category: string): number => {
      if (!paintData) return 0;

      const categoryProducts = paintData.products.filter(
        (p) => p.category === category
      );
      if (categoryProducts.length === 0) return 0;

      const totalPrice = categoryProducts.reduce(
        (sum, product) => sum + product.price,
        0
      );
      return totalPrice / categoryProducts.length;
    },
    [paintData]
  );

  const getPriceRangeByCategory = useCallback(
    (category: string): { min: number; max: number; avg: number } => {
      if (!paintData) return { min: 0, max: 0, avg: 0 };

      const categoryProducts = paintData.products.filter(
        (p) => p.category === category
      );
      if (categoryProducts.length === 0) return { min: 0, max: 0, avg: 0 };

      const prices = categoryProducts.map((p) => p.price);
      return {
        min: Math.min(...prices),
        max: Math.max(...prices),
        avg: prices.reduce((sum, price) => sum + price, 0) / prices.length,
      };
    },
    [paintData]
  );

  // Auto-fetch on mount
  useEffect(() => {
    if (autoFetch) {
      fetchPrices();
    }
  }, [autoFetch, fetchPrices]);

  // Set up refresh interval
  useEffect(() => {
    if (!refreshInterval || !autoFetch) return;

    const interval = setInterval(() => {
      fetchPrices();
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [refreshInterval, autoFetch, fetchPrices]);

  return {
    paintData,
    isLoading,
    error,
    lastUpdated,
    isCached,
    fetchPrices,
    getPriceByCategory,
    getPriceRangeByCategory,
  };
}
