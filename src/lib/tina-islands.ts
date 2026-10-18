import type { IslandRegistry } from '@tinacms/astro/experimental';
import HomeSections from '../components/HomeSections.astro';
import { loadHomeData } from './tina';

/**
 * Zones éditables visuellement. Chaque entrée doit correspondre à un <TinaIsland name="…">
 * dans une page, avec le même wrapper.
 */
export const islands: IslandRegistry = {
  home: {
    fetch: () => loadHomeData(),
    component: HomeSections,
    wrapper: { tag: 'div' },
    propsFromData: (data) => data as Record<string, unknown>,
  },
};
