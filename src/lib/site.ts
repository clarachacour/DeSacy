import { getCollection, type CollectionEntry } from 'astro:content';

export type Artwork = CollectionEntry<'artworks'>;

export { CONTACT } from './contact';

export async function getArtworks(): Promise<Artwork[]> {
  return (await getCollection('artworks')).sort((a, b) => a.data.order - b.data.order);
}

const inch = (cm: number) => Math.round(cm / 2.54);

export function dims(a: Artwork['data']): string | undefined {
  if (!a.width || !a.height) return undefined;
  const cm = [a.width, a.height, a.depth].filter(Boolean) as number[];
  return `${cm.join(' × ')} cm | ${cm.map(inch).join(' × ')} in`;
}

export const STATUS_LABEL = { available: 'Available', sold: 'Sold', commissioned: 'Commission' } as const;
