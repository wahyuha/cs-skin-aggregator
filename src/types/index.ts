// Core scraper interfaces
export interface ScrapedListing {
    marketplace: string;
    itemName: string;
    price: number;
    currency: string;
    url: string;
    lastUpdated: Date;
  }
  
  export interface ScrapeResult {
    success: boolean;
    listings: ScrapedListing[];
    error?: string;
    scrapedAt: Date;
  }
  
  export interface IScraper {
    name: string;
    scrape(skinName: string): Promise<ScrapeResult>;
    isAvailable(): Promise<boolean>;
  }
  
  // API response interfaces
  export interface BestDeal {
    listing: ScrapedListing;
    score: number;
    reason: string;
  }
  
  export interface Warning {
    marketplace: string;
    error: string;
    timestamp: string;
  }
  
  export interface ErrorDetail {
    marketplace: string;
    error: string;
    timestamp: string;
  }
  
  export interface AggregatedResponse {
    skinName: string;
    totalListings: number;
    bestDeal: BestDeal | null;
    allListings?: ScrapedListing[];
    marketplaceStatus?: Record<string, 'success' | 'failed'>;
    warnings?: Warning[];
    errors?: ErrorDetail[];
    cached: boolean;
    cachedAt?: Date;
    cacheExpiresIn?: string;
    responseTime: string;
  }
  
  // API response wrappers
  export interface ApiSuccessResponse {
    success: true;
    data: AggregatedResponse;
  }
  
  export interface ApiErrorResponse {
    success: false;
    error: {
      code: string;
      message: string;
      details?: string;
    };
    data?: Partial<AggregatedResponse>;
  }
  
  export type ApiResponse = ApiSuccessResponse | ApiErrorResponse;
  