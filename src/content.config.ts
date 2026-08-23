import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const posts = defineCollection({
  loader: glob({
    pattern: "**/*.{md,mdx}",
    base: "./src/content/posts",
  }),

  schema: z.object({
    title: z.string(),
    subtitle: z.string(),

    category: z.enum([
      "TECH",
      "RESEARCH",
      "CAREER",
    ]),

    author: z.string(),
    authorUrl: z.string().url().optional(),

    date: z.coerce.date(),

    description: z.string().optional(),

    ogImage: z.string().optional(),

    visual: z.string().optional(),

    draft: z.boolean().default(false),
  }),
});

export const collections = {
  posts,
};