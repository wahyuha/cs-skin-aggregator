import { ScrapedListing } from '../../types';
import { httpGet, matchesSkinName, buildQueryParams } from '../../utils/http';

interface SteamSearchResponse {
  success: boolean;
  results?: SteamSearchResult[];
  total_count?: number;
}

interface SteamSearchResult {
  name: string;
  hash_name: string;
  sell_listings: number;
  sell_price: number;
  sell_price_text?: string;
  app_name: string;
}

export async function fetchSteam(query: string): Promise<SteamSearchResponse> {
  const baseUrl = 'https://steamcommunity.com/market/search/render/';
  const params = buildQueryParams({
    query,
    norender: '1',
    appid: '730', // CS2
  });

  return httpGet<SteamSearchResponse>(`${baseUrl}?${params}`);
}

export function transformSteam(
  data: SteamSearchResponse,
  query: string
): ScrapedListing[] {
  if (!data.success || !data.results) {
    return [];
  }

  const filtered = data.results.filter(
    (item) =>
      item.app_name === 'Counter-Strike 2' &&
      matchesSkinName(item.hash_name, query)
  );

  return filtered.map((item) => ({
    marketplace: 'Steam Community Market',
    itemName: item.hash_name,
    price: item.sell_price,
    currency: '',
    url: `https://steamcommunity.com/market/listings/730/${encodeURIComponent(item.hash_name)}`,
    lastUpdated: new Date(),
  }));
}