import {
  ScrapedListing,
  AggregatedResponse,
  Warning,
  ErrorDetail,
} from '../types';
import { scrapeSteamMarketplace } from '../scrapers/registry';

export async function aggregatePrices(
  skinName: string,
  withVariant: boolean = false
): Promise<AggregatedResponse> {
  const startTime = Date.now();

  try {
    const scrapeResult = await scrapeSteamMarketplace(skinName);
    // console.log(scrapeResult);

    const allListings: ScrapedListing[] = [];
    const marketplaceStatus: Record<string, 'success' | 'failed'> = {};
    const warnings: Warning[] = [];
    const errors: ErrorDetail[] = [];

    if (scrapeResult.success) {
      allListings.push(...scrapeResult.listings);
      marketplaceStatus['Steam Community Market'] = 'success';
    } else {
      //
    }

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
      marketplace: 'Steam Community Market',
      error: errorMessage,
      timestamp: new Date().toISOString(),
    };

    const response: AggregatedResponse = {
      skinName,
      totalListings: 0,
      bestDeal: undefined,
      allListings: undefined,
      marketplaceStatus: { 'Steam Community Market': 'failed' },
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
