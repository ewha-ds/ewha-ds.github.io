import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import { isPublished } from "../lib/posts";
import { xmlEscape } from "../lib/xml";

// RSS 피드: 최신 공개 글 (네이버 서치어드바이저 RSS 제출, 구독기용)
export const GET: APIRoute = async ({ site }) => {
  const base = site ?? new URL("https://ewha-ds.github.io");
  const abs = (path: string) => new URL(path, base).toString();

  const posts = (await getCollection("posts"))
    .filter(isPublished)
    .sort((a, b) => b.data.date.getTime() - a.data.date.getTime())
    .slice(0, 50);

  const items = posts
    .map((post) => {
      const link = abs(`/posts/${post.id}/`);
      return `    <item>
      <title>${xmlEscape(post.data.title)}</title>
      <link>${xmlEscape(link)}</link>
      <guid isPermaLink="true">${xmlEscape(link)}</guid>
      <description>${xmlEscape(post.data.description ?? post.data.subtitle)}</description>
      <category>${xmlEscape(post.data.category)}</category>
      <dc:creator>${xmlEscape(post.data.author)}</dc:creator>
      <pubDate>${post.data.date.toUTCString()}</pubDate>
    </item>`;
    })
    .join("\n");

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>EWHA DS</title>
    <link>${xmlEscape(abs("/"))}</link>
    <description>이화여자대학교 데이터사이언스전공 학생회가 운영하는 학술·진로 콘텐츠 아카이브</description>
    <language>ko</language>
    <atom:link href="${xmlEscape(abs("/rss.xml"))}" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>
`;

  return new Response(body, {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8" },
  });
};
