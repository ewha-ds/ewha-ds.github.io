import type { CollectionEntry } from "astro:content";

type Notice = CollectionEntry<"notices">;

/*
  공지 종류 이름. 순서대로 목록 필터 버튼에 표시됩니다.
  종류를 추가하려면 세 곳을 함께 수정하세요:
    1. 여기
    2. src/content.config.ts 의 notices.type
    3. .pages.yml notice 컬렉션의 type 선택지
*/
export const NOTICE_TYPES = [
  { key: "EVENT", label: "행사 소식" },
  { key: "PROGRAM", label: "학과 사업" },
  { key: "GENERAL", label: "공지" },
] as const;

export const noticeTypeLabel = (type: Notice["data"]["type"]) =>
  NOTICE_TYPES.find((t) => t.key === type)?.label ?? type;

// 고정 공지 먼저, 그다음 최신순
export const sortNotices = (a: Notice, b: Notice) =>
  Number(b.data.pinned) - Number(a.data.pinned) ||
  b.data.date.getTime() - a.data.date.getTime();
