import type { ActuResponse } from './ActuResponse';

export type LandingActuItem = ActuResponse & {
    artistSlug?: string;
    artistName?: string;
};
