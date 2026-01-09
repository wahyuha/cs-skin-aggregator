import { ScrapedListing } from '../../types';
import { httpGet, matchesSkinName, buildQueryParams } from '../../utils/http';

interface CSFloatListingsResponse {
  data?: CSFloatListing[];
}

interface CSFloatListing {
  id: string;
  price: number;
  item: {
    market_hash_name: string;
    float_value?: number;
  };
}

export async function fetchCSFloat(query: string): Promise<CSFloatListingsResponse> {
  const baseUrl = 'https://csfloat.com/api/v1/listings';
  const params = buildQueryParams({
    search: query,
  });

  return httpGet<CSFloatListingsResponse>(`${baseUrl}?${params}`);
}

export function transformCSFloat(
  data: CSFloatListingsResponse,
  query: string
): ScrapedListing[] {
  if (!data.data) {
    return [];
  }

  const filtered = data.data.filter((item) =>
    matchesSkinName(item.item.market_hash_name, query)
  );

  // normalize
  return filtered.map((item) => ({
    marketplace: 'CSFloat',
    itemName: item.item.market_hash_name,
    price: item.price,
    currency: 'USD',
    url: `https://csfloat.com/item/${item.id}`,
    lastUpdated: new Date(),
  }));
}
