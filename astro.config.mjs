// @ts-check

import { defineConfig } from "astro/config";
import { unified } from "@astrojs/markdown-remark";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";

export default defineConfig({
  site: "https://ewha-ds.github.io",

  // CMS 도입 시 글 폴더 구조를 평평하게 바꾸면서 바뀐 옛 주소를 새 주소로 연결
  redirects: {
    "/posts/tech/26_09/agentic-ai": "/posts/tech/agentic-ai",
  },

  markdown: {
    processor: unified({
      remarkPlugins: [remarkMath],
      rehypePlugins: [rehypeKatex],
    }),
  },
});