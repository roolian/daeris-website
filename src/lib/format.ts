const eur = new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 0 });

/** « 2 500 – 4 000 € HT » ou « 59 € HT / mois » */
export function formatPrice(min: number | null, max: number | null, unit = 'HT'): string {
  const range = max && min !== max ? `${eur.format(min ?? 0)} – ${eur.format(max)}` : eur.format(min ?? 0);
  return `${range} € ${unit}`.trim();
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('fr-FR', { dateStyle: 'long' }).format(date);
}
