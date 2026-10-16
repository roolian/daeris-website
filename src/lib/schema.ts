import type { Site } from './content';

/** JSON-LD ProfessionalService (sous-type de LocalBusiness). Source unique du NAP : settings/site.yaml */
export function localBusinessSchema(site: Site, siteUrl: URL) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    '@id': new URL('/#business', siteUrl).href,
    name: site.name,
    legalName: site.legalName || undefined,
    description: site.description || undefined,
    url: siteUrl.href,
    logo: new URL('/brand/icon-256x256.png', siteUrl).href,
    image: new URL('/brand/icon-256x256.png', siteUrl).href,
    telephone: site.phoneE164 || undefined,
    email: site.email || undefined,
    address: {
      '@type': 'PostalAddress',
      streetAddress: site.street || undefined,
      postalCode: site.postalCode,
      addressLocality: site.city,
      addressRegion: site.region,
      addressCountry: 'FR',
    },
    geo:
      site.latitude && site.longitude
        ? { '@type': 'GeoCoordinates', latitude: Number(site.latitude), longitude: Number(site.longitude) }
        : undefined,
    areaServed: site.areaServed.map((name) => ({ '@type': 'Place', name })),
    sameAs: site.social.map((s) => s.url).filter(Boolean),
    priceRange: '€€',
  };
}
