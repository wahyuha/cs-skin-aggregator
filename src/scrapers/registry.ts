import { Marketplace } from '../marketplaces/types';
import { ScrapeResult } from '../types';
import { createErrorResult, createSuccessResult, withTimeout } from './helpers';

const marketplaces = new Map<string, Marketplace>();

export function registerMarketplace(marketplace: Marketplace): void {
  marketplaces.set(marketplace.name, marketplace);
}

export function getAllMarketplaces(): Marketplace[] {
  return Array.from(marketplaces.values());
}

export async function scrapeMarketplace(
  marketplace: Marketplace,
  skinName: string
): Promise<ScrapeResult> {
  try {
    const data = await withTimeout(marketplace.fetch(skinName), 10000);
    const listings = marketplace.transform(data, skinName);

    if (listings.length === 0) {
      return createErrorResult(
        `No ${marketplace.name} listings found for "${skinName}"`
      );
    }

    return createSuccessResult(listings);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error occurred';
    return createErrorResult(errorMessage);
  }
}
