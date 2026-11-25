import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import { isPublished } from "../lib/posts";
import { xmlEscape } from "../lib/xml";

// 검색엔진용 페이지 목록. 공개 글만 포함 (/preview/ 는 제외)
export const GET: APIRoute = async ({ site }) => {
  const base = site ?? new URL("https://ewha-ds.github.io");
  const url = (path: string) => xmlEscape(new URL(path, base).toString());

  const posts = (await getCollection("posts"))
    .filter(isPublished)
    .sort((a, b) => b.data.date.getTime() - a.data.date.getTime());

  const notices = (await getCollection("notices"))
    .filter(isPublished)
    .sort((a, b) => b.data.date.getTime() - a.data.date.getTime());

  const pages = ["/", "/tech/", "/research/", "/career/", "/notice/"];

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages.map((p) => `  <url><loc>${url(p)}</loc></url>`).join("\n")}
${posts
  .map(
    (post) =>
      `  <url><loc>${url(`/posts/${post.id}/`)}</loc><lastmod>${post.data.date.toISOString()}</lastmod></url>`
  )
  .join("\n")}
${notices
  .map(
    (notice) =>
      `  <url><loc>${url(`/notice/${notice.id}/`)}</loc><lastmod>${notice.data.date.toISOString()}</lastmod></url>`
  )
  .join("\n")}
</urlset>
`;

  return new Response(body, {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
};
