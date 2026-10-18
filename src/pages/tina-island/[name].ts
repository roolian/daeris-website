import { experimental_createIslandRoute } from '@tinacms/astro/experimental';
import { islands } from '../../lib/tina-islands';

// Route utilisée uniquement par l'éditeur visuel de Tina (POST depuis l'iframe de l'admin).
export const prerender = false;
export const POST = experimental_createIslandRoute(islands);
