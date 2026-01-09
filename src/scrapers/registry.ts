import { ScrapeResult } from '../types';
import { createErrorResult, createSuccessResult, withTimeout } from './helpers';
import { steamMarketplace } from '../marketplaces/config';

export async function scrapeSteamMarketplace(skinName: string): Promise<ScrapeResult> {
  try {
    const data = await withTimeout(steamMarketplace.fetch(skinName), 10000);

    const listings = steamMarketplace.transform(data, skinName);

    if (listings.length === 0) {
      return createErrorResult(
        `No ${steamMarketplace.name} listings found for "${skinName}"`
      );
    }

    return createSuccessResult(listings);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error occurred';
    return createErrorResult(errorMessage);
  }
}
