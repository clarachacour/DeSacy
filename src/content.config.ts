import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// One Markdown file per sculpture in src/content/artworks. The body is the description.
const artworks = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/artworks' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      series: z.enum(['Life in movement', 'Nature']),
      order: z.number(),
      year: z.number().optional(),
      width: z.number().optional(),
      height: z.number().optional(),
      depth: z.number().optional(),
      layers: z.number().optional(),
      medium: z.string().optional(),
      edition: z.string().optional(),
      status: z.enum(['available', 'sold', 'commissioned']).optional(),
      image: image().optional(),
      cover: z.boolean().default(false),
      room: image().optional(),
      roomCaption: z.string().default('Visualisation in an interior'),
      featured: z.boolean().default(false),
    }),
});

export const collections = { artworks };
