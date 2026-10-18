import { getEntry, type CollectionEntry } from 'astro:content';

type SingletonName = 'site' | 'home' | 'offers';

async function singleton<T extends SingletonName>(name: T): Promise<CollectionEntry<T>['data']> {
  const entry = await getEntry(name, name);
  if (!entry) throw new Error(`Contenu manquant : src/content/settings/${name}.yaml`);
  return entry.data;
}

export const getSite = () => singleton('site');
export const getHome = () => singleton('home');
export const getOffers = () => singleton('offers');

export type Site = CollectionEntry<'site'>['data'];
export type Home = CollectionEntry<'home'>['data'];
export type Offers = CollectionEntry<'offers'>['data'];
export type Offer = Offers['packs'][number];
