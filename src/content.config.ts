import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// One Markdown file per sculpture in src/content/artworks. The body is the description.
// The admin tool (Pages CMS) can save empty fields as "" or null, so those count as "not set".
const blank = (v: unknown) => (v === '' || v === null ? undefined : v);
const opt = <T extends z.ZodTypeAny>(t: T) => z.preprocess(blank, t.optional());

const artworks = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/artworks' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      series: z.enum(['Life in movement', 'Nature']),
      order: z.preprocess(blank, z.coerce.number().default(99)),
      year: opt(z.coerce.number()),
      width: opt(z.coerce.number()),
      height: opt(z.coerce.number()),
      depth: opt(z.coerce.number()),
      layers: opt(z.coerce.number()),
      medium: opt(z.string()),
      edition: opt(z.string()),
      status: opt(z.enum(['available', 'sold', 'commissioned'])),
      image: opt(image()),
      cover: z.preprocess(blank, z.boolean().default(false)),
      room: opt(image()),
      roomCaption: z.preprocess(blank, z.string().default('Visualisation in an interior')),
      featured: z.preprocess(blank, z.boolean().default(false)),
    }),
});

export const collections = { artworks };
