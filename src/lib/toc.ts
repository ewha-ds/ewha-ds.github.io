// 오른쪽 목차(CONTENTS) 항목 만들기. 글(ArticlePage)과 공지(NoticePage)가 같이 씀.
//
// 규칙: 제목 단계대로 계층 목차.
// - 글에 쓰인 제목 단계(# ~ #####)를 큰 순서대로 0, 1, 2… 단계로 매김. (######는 제외)
//   예: ##, ###, ##### 를 쓴 글 → ## 는 0단계, ### 는 1단계, ##### 는 2단계
// - 0단계(가장 큰 제목)에만 01, 02 번호. 아래 단계는 들여쓰기.
// - # 와 ## 는 같은 단계로 취급 (예전 글 호환).
// 본문 제목에 붙은 번호("1.", "2.1")는 목차가 01, 02로 따로 매기므로 떼어낸다.

type Heading = { depth: number; slug: string; text: string };

export type TocItem = Heading & { level: number; number?: string };

export function buildToc(headings: Heading[]): TocItem[] {
  const norm = (d: number) => Math.max(2, d);
  const used = headings.filter((h) => h.depth <= 5);
  const depths = [...new Set(used.map((h) => norm(h.depth)))].sort((a, b) => a - b);

  let n = 0;
  return used.map((h) => {
    const level = depths.indexOf(norm(h.depth));
    return {
      ...h,
      text: h.text.replace(/^\d+(\.\d+)*\.?\s+/, "") || h.text,
      level,
      number: level === 0 ? String(++n).padStart(2, "0") : undefined,
    };
  });
}
