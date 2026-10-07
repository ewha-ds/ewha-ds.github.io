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

    // CMS가 파일 이름(=글 주소)을 만들 때 쓰는 값. 사이트 렌더링에는 사용하지 않음.
    // 주의: 이름을 slug로 바꾸면 Astro가 글 id로 사용해 URL 구조가 바뀜.
    urlKey: z.string().optional(),

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

    // 홈 대표 이미지. visual(도식)이 없을 때 그 자리에 들어감.
    homeImage: z.string().optional(),

    // 빠뜨리면 비공개. 공개하려면 draft: false 를 명시해야 함.
    draft: z.boolean().default(true),
  }),
});

export const collections = {
  posts,
};