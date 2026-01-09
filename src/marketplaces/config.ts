import { Marketplace } from './types';
import { fetchSteam, transformSteam } from './handlers/steam-handler';
import { fetchCSFloat, transformCSFloat } from './handlers/csfloat-handler';

export const steamMarketplace: Marketplace = {
  name: 'Steam Community',
  enabled: true,
  fetch: fetchSteam,
  transform: transformSteam,
};

export const csfloatMarketplace: Marketplace = {
  name: 'CSFloat',
  enabled: true,
  fetch: fetchCSFloat,
  transform: transformCSFloat,
};

export const marketplaces: Marketplace[] = [
  steamMarketplace,
  csfloatMarketplace,
];