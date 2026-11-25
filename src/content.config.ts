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

// 공지 (NOTICE): 행사 소식·학과 사업 홍보 등. 글(posts)과 별도로 관리하며
// 홈 FEATURED·다음에 읽을 글·RSS에는 섞이지 않습니다.
// 필드를 바꿀 때는 .pages.yml 의 notice 컬렉션도 함께 수정하세요.
const notices = defineCollection({
  loader: glob({
    pattern: "**/*.{md,mdx}",
    base: "./src/content/notices",
  }),

  schema: z.object({
    title: z.string(),

    // 한 줄 설명 (선택). 제목 아래·목록 카드·링크 공유 설명에 쓰임
    subtitle: z.string().optional(),

    // 공지 종류. 이름(라벨)은 src/lib/notices.ts 에서 관리
    type: z.enum(["EVENT", "PROGRAM", "GENERAL"]),

    urlKey: z.string().optional(),

    date: z.coerce.date(),

    // 목록 맨 위 고정
    pinned: z.boolean().default(false),

    // 포스터·대표 이미지 (선택)
    image: z.string().optional(),

    // 신청 폼 등 바깥 링크 (선택). CMS에서 빈 값으로 저장될 수 있어 "" 허용
    link: z.union([z.string().url(), z.literal("")]).optional(),

    draft: z.boolean().default(true),
  }),
});

export const collections = {
  posts,
  notices,
};