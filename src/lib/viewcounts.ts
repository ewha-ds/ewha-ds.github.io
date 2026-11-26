import { goatcounterBase } from "./analytics";

/*
  빌드할 때 GoatCounter API로 페이지별 조회수를 받아 둡니다. (매시간 자동 빌드 → 약 1시간마다 갱신)
  GoatCounter의 공개 카운터(/counter/*.json)는 결과를 몇 시간씩 캐시하기 때문에,
  빌드 시점 숫자를 페이지에 미리 넣고 브라우저에서는 둘 중 큰 값을 보여줍니다 (ViewCount.astro).

  키: GitHub 저장소 Settings → Secrets and variables → Actions → GOATCOUNTER_API_KEY
      (GoatCounter → 사용자 설정 → API, "Read statistics" 권한만)
  키가 없거나 요청이 실패하면 빈 값 → 예전처럼 브라우저에서만 불러옵니다. 빌드는 실패하지 않습니다.
*/

// 조회 시작 시각 후보. GoatCounter 사이트 생성(2026-11-25 KST) 이전 시각을 주면 404가 나므로,
// 생성일 0시(KST)부터 1시간씩 늦춰 가며 시도하고, 끝까지 안 되면 API 기본값(최근 1주)을 사용.
const SITE_CREATED_KST = Date.UTC(2026, 10, 24, 15); // 2026-11-25 00:00 KST
const STARTS: (string | undefined)[] = [
  ...Array.from({ length: 25 }, (_, h) =>
    new Date(SITE_CREATED_KST + h * 3_600_000).toISOString().replace(".000Z", "Z")
  ),
  undefined,
];

type Hit = { path: string; path_id: number; count: number };

let cache: Promise<Map<string, number>> | undefined;

export function getViewCounts(): Promise<Map<string, number>> {
  cache ??= load();
  return cache;
}

async function load(): Promise<Map<string, number>> {
  const key = process.env.GOATCOUNTER_API_KEY;
  if (!key || !goatcounterBase) return new Map();

  for (const start of STARTS) {
    // 요청 제한(초당 4회) 피하기
    await new Promise((r) => setTimeout(r, 300));
    try {
      const counts = await loadFrom(key, start);
      if (counts) {
        console.log(`[viewcounts] ${counts.size} paths loaded (start=${start ?? "default"})`);
        return counts;
      }
    } catch (err) {
      console.warn(`[viewcounts] GoatCounter API 실패 (start=${start ?? "default"})`, err);
      break;
    }
  }
  console.warn("[viewcounts] 조회수는 브라우저에서만 불러옵니다.");
  return new Map();
}

async function loadFrom(key: string, start: string | undefined): Promise<Map<string, number> | null> {
  const counts = new Map<string, number>();
  const exclude: number[] = [];

  // 페이지 수가 많아도 최대 20번(2,000개 경로)까지만
  for (let i = 0; i < 20; i++) {
    const params = new URLSearchParams({ limit: "100" });
    if (start) params.set("start", start);
    for (const id of exclude) params.append("exclude_paths", String(id));

    const res = await fetch(`${goatcounterBase}/api/v0/stats/hits?${params}`, {
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    });
    if (!res.ok) {
      const body = (await res.text()).replace(/\s+/g, " ").slice(0, 200);
      console.warn(`[viewcounts] GoatCounter API ${res.status} (start=${start ?? "default"}): ${body}`);
      // 키 문제(401/403)는 시작 시각을 바꿔도 같으므로 바로 포기
      if (res.status === 401 || res.status === 403) throw new Error(`auth ${res.status}`);
      return null;
    }

    const data = (await res.json()) as { hits?: Hit[]; more?: boolean };
    for (const hit of data.hits ?? []) {
      counts.set(hit.path, (counts.get(hit.path) ?? 0) + hit.count);
      exclude.push(hit.path_id);
    }
    if (!data.more || !data.hits?.length) break;
  }
  return counts;
}

/** 경로의 빌드 시점 조회수 (없으면 undefined). /a/b 와 /a/b/ 를 같은 페이지로 봄 */
export async function getViewCount(pathname: string): Promise<number | undefined> {
  const counts = await getViewCounts();
  const withSlash = pathname.endsWith("/") ? pathname : `${pathname}/`;
  const without = withSlash.slice(0, -1);
  const total = (counts.get(withSlash) ?? 0) + (counts.get(without) ?? 0);
  return total > 0 ? total : undefined;
}
