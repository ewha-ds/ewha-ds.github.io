import type { CollectionEntry } from "astro:content";

type Post = CollectionEntry<"posts">;

/*
  공개 규칙 (사이트 전체에서 이 파일만 기준으로 사용)

  - 임시저장(draft: true)            → 비공개, /preview/ 에서만 보임
  - 공개(draft: false) + 게시 시각 전 → 예약, /preview/ 에서만 보임
  - 공개(draft: false) + 게시 시각 후 → 공개

  "지금"은 빌드 시각입니다. GitHub Actions가 매시간 다시 빌드하므로
  예약 글은 게시 시각 이후 약 1시간 안에 자동으로 공개됩니다.
  (.github/workflows/deploy.yml 의 schedule)

  시간대: 빌드 환경에 TZ=Asia/Seoul 이 설정되어 있어
  "2026-09-25T09:00" 은 한국 시간 오전 9시로 해석됩니다.
*/

const buildTime = new Date();

export const isPublished = (post: Post) =>
  !post.data.draft && post.data.date.getTime() <= buildTime.getTime();

export const isScheduled = (post: Post) =>
  !post.data.draft && post.data.date.getTime() > buildTime.getTime();

export const isPreviewOnly = (post: Post) => !isPublished(post);

export const previewStatus = (post: Post) =>
  isScheduled(post) ? "예약" : "임시저장";

export const formatDateTime = (d: Date) =>
  `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")} ` +
  `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
