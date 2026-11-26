// 오른쪽 목차(CONTENTS) 항목 만들기. 글(ArticlePage)과 공지(NoticePage)가 같이 씀.
//
// 규칙
// 1. 큰 제목 단계(#, ##)를 목차로. ##가 없는 글은 글에서 가장 큰 제목 단계를 사용.
// 2. 그 단계 제목이 하나뿐이면(글 제목을 ##로 한 번 쓴 Q&A 글 등) 한 단계 아래(###)를 목차로.
// 3. 질문 제목(####, #####)은 목차 아래에 들여쓴 하위 항목으로 추가.
// 본문 제목에 붙은 번호("1.", "2.1")는 목차가 01, 02로 따로 매기므로 떼어낸다.

type Heading = { depth: number; slug: string; text: string };

export type TocItem = Heading & { sub: boolean; number?: string };

const QUESTION_DEPTHS = [4, 5];

export function buildToc(headings: Heading[]): TocItem[] {
  if (headings.length === 0) return [];

  let top = Math.max(2, Math.min(...headings.map((h) => h.depth)));
  let above = 0; // 이 단계 이하(더 큰 제목)는 목차에서 제외

  const atTop = headings.filter((h) => h.depth <= top);
  if (atTop.length === 1) {
    const next = headings.find((h) => h.depth > top && h.depth <= 3);
    if (next) {
      above = top;
      top = next.depth;
    }
  }

  let n = 0;
  const items: TocItem[] = [];

  for (const h of headings) {
    const main = h.depth > above && h.depth <= top;
    const sub = !main && h.depth > top && QUESTION_DEPTHS.includes(h.depth);
    if (!main && !sub) continue;

    items.push({
      ...h,
      text: h.text.replace(/^\d+(\.\d+)*\.?\s+/, "") || h.text,
      sub,
      number: main ? String(++n).padStart(2, "0") : undefined,
    });
  }

  return items;
}
