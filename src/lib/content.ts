import { createReader } from '@keystatic/core/reader';
import keystaticConfig from '../../keystatic.config';

const reader = createReader(process.cwd(), keystaticConfig);

async function required<T>(name: string, value: Promise<T | null>): Promise<T> {
  const data = await value;
  if (!data) throw new Error(`Contenu Keystatic manquant : singleton « ${name} »`);
  return data;
}

export const getSite = () => required('site', reader.singletons.site.read());
export const getHome = () => required('home', reader.singletons.home.read());
export const getOffers = () => required('offers', reader.singletons.offers.read());

export type Site = Awaited<ReturnType<typeof getSite>>;
export type Home = Awaited<ReturnType<typeof getHome>>;
export type Offers = Awaited<ReturnType<typeof getOffers>>;
export type Offer = Offers['packs'][number];
