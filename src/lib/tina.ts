import { requestWithMetadata, tinaField } from '@tinacms/astro';
import client from '../../tina/__generated__/client';
import type { Home, Offers, Site } from './content';

/**
 * Données de la home via le client GraphQL de Tina : nécessaire pour l'édition visuelle
 * (requestWithMetadata ajoute les métadonnées qui relient le DOM aux champs du formulaire).
 * Les données ont la même forme que les schémas zod de src/content.config.ts.
 */
export async function loadHomeData() {
  const [home, offers, site] = await Promise.all([
    requestWithMetadata(client.queries.home({ relativePath: 'home.yaml' }), { priority: 'primary' }),
    requestWithMetadata(client.queries.offers({ relativePath: 'offers.yaml' })),
    requestWithMetadata(client.queries.site({ relativePath: 'site.yaml' })),
  ]);
  return {
    home: home.data.home as unknown as Home,
    offers: offers.data.offers as unknown as Offers,
    site: site.data.site as unknown as Site,
  };
}

export type HomeData = Awaited<ReturnType<typeof loadHomeData>>;

/**
 * Valeur de l'attribut data-tina-field (clic-pour-éditer).
 * Renvoie undefined hors édition, pour ne rien émettre dans le HTML de production.
 */
export function tf(object: unknown, property?: string, index?: number): string | undefined {
  // tinaField est typé pour les objets Tina ; on accepte nos types zod (mêmes données).
  return tinaField(object as Record<string, unknown>, property as never, index) || undefined;
}
