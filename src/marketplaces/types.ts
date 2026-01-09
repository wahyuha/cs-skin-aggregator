import { ScrapedListing } from '../types';


export interface Marketplace {
  name: string;
  enabled: boolean;
  fetch: (query: string) => Promise<any>;
  transform: (data: any, query: string) => ScrapedListing[];
}