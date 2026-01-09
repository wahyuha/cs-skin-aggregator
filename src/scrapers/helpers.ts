import { ScrapeResult, ScrapedListing } from '../types';

export function createErrorResult(error: string): ScrapeResult {
  return {
    success: false,
    listings: [],
    error,
    scrapedAt: new Date(),
  };
}

export function createSuccessResult(listings: ScrapedListing[]): ScrapeResult {
  return {
    success: true,
    listings,
    scrapedAt: new Date(),
  };
}

export async function withTimeout<T>(
  promise: Promise<T>,
  timeoutMs: number = 10000
): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(
        () => reject(new Error(`Request timeout after ${timeoutMs}ms`)),
        timeoutMs
      )
    ),
  ]);
}
