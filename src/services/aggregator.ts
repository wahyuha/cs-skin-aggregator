import {
  ScrapedListing,
  AggregatedResponse,
  Warning,
  ErrorDetail,
} from '../types';
import { scrapeMarketplace, getAllMarketplaces } from '../scrapers/registry';

export async function aggregatePrices(
  skinName: string,
  withVariant: boolean = false
): Promise<AggregatedResponse> {
  const startTime = Date.now();

  const marketplaces = getAllMarketplaces();

  if (marketplaces.length === 0) {
    throw new Error('No marketplaces registered');
  }

  try {
    const scrapePromises = marketplaces.map(async (marketplace) => ({
      marketplaceName: marketplace.name,
      result: await scrapeMarketplace(marketplace, skinName),
    }));
  
    const results = await Promise.allSettled(scrapePromises);

    const allListings: ScrapedListing[] = [];
    const marketplaceStatus: Record<string, 'success' | 'failed'> = {};
    const warnings: Warning[] = [];
    const errors: ErrorDetail[] = [];

    results.forEach((result) => {
      if (result.status === 'fulfilled') {
        const { marketplaceName, result: scrapeResult } = result.value;

        if (scrapeResult.success) {
          allListings.push(...scrapeResult.listings);
          marketplaceStatus[marketplaceName] = 'success';
        }
      }
    });

    const bestDeal = calculateBestDeal(allListings);

    const responseTime = ((Date.now() - startTime) / 1000).toFixed(2) + 's';

    // Sort all listings by price ascending if withVariant=1
    if (withVariant && allListings.length > 0) {
      allListings.sort((a, b) => {
        const priceA = a.price;
        const priceB = b.price;
        return priceA - priceB;
      });
    }

    const response: AggregatedResponse = {
      skinName,
      totalListings: withVariant ? allListings.length : 0,
      bestDeal,
      allListings: withVariant ? allListings : undefined,
      marketplaceStatus,
      warnings: warnings.length > 0 ? warnings : undefined,
      errors: errors.length > 0 ? errors : undefined,
      cached: false,
      cachedAt: new Date(),
      responseTime,
    };

    return response;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    const errorDetail: ErrorDetail = {
      marketplace: 'Steam Community',
      error: errorMessage,
      timestamp: new Date().toISOString(),
    };

    const response: AggregatedResponse = {
      skinName,
      totalListings: 0,
      bestDeal: undefined,
      allListings: undefined,
      marketplaceStatus: { 'Steam Community': 'failed' },
      warnings: [errorDetail],
      errors: [errorDetail],
      cached: false,
      cachedAt: new Date(),
      responseTime: ((Date.now() - startTime) / 1000).toFixed(2) + 's',
    };

    return response;
  }
}

function calculateBestDeal(listings: ScrapedListing[]): ScrapedListing | undefined {
  if (listings.length === 0) return undefined;

  const cheapest = listings.reduce((cheapest, current) => {
    const cheapestPrice = cheapest.price;
    const currentPrice = current.price;
    return currentPrice < cheapestPrice ? current : cheapest;
  });

  return { ...cheapest, currency: 'USD' };
}
