import { fetchSteam, transformSteam } from './handlers/steam-handler';

export const steamMarketplace = {
  name: 'Steam Community Market',
  fetch: fetchSteam,
  transform: transformSteam,
};
