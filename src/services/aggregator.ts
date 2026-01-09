import {
  AggregatedResponse,
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
    console.log(scrapeResult);

    const response: AggregatedResponse = {
      skinName,
      totalListings: 0,
      bestDeal: null,
      allListings: undefined,
      warnings: undefined,
      errors: undefined,
      cached: false,
      responseTime: '',
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
      bestDeal: null,
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
