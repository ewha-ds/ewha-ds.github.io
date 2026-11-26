import { goatcounterBase } from "./analytics";

/*
  빌드할 때 GoatCounter API로 페이지별 조회수를 받아 둡니다. (매시간 자동 빌드 → 약 1시간마다 갱신)
  GoatCounter의 공개 카운터(/counter/*.json)는 결과를 몇 시간씩 캐시하기 때문에,
  빌드 시점 숫자를 페이지에 미리 넣고 브라우저에서는 둘 중 큰 값을 보여줍니다 (ViewCount.astro).

  키: GitHub 저장소 Settings → Secrets and variables → Actions → GOATCOUNTER_API_KEY
      (GoatCounter → 사용자 설정 → API, "Read statistics" 권한만)
  키가 없거나 요청이 실패하면 빈 값 → 예전처럼 브라우저에서만 불러옵니다. 빌드는 실패하지 않습니다.
*/

const START = "2026-01-01T00:00:00Z";

type Hit = { path: string; path_id: number; count: number };

let cache: Promise<Map<string, number>> | undefined;

export function getViewCounts(): Promise<Map<string, number>> {
  cache ??= load();
  return cache;
}

async function load(): Promise<Map<string, number>> {
  const counts = new Map<string, number>();
  const key = process.env.GOATCOUNTER_API_KEY;
  if (!key || !goatcounterBase) return counts;

  try {
    const exclude: number[] = [];
    // 페이지 수가 많아도 최대 20번(2,000개 경로)까지만
    for (let i = 0; i < 20; i++) {
      const params = new URLSearchParams({ start: START, limit: "100" });
      for (const id of exclude) params.append("exclude_paths", String(id));

      const res = await fetch(`${goatcounterBase}/api/v0/stats/hits?${params}`, {
        headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      });
      if (!res.ok) {
        console.warn(`[viewcounts] GoatCounter API ${res.status}; 조회수는 브라우저에서만 불러옵니다.`);
        return counts;
      }

      const data = (await res.json()) as { hits?: Hit[]; more?: boolean };
      for (const hit of data.hits ?? []) {
        counts.set(hit.path, (counts.get(hit.path) ?? 0) + hit.count);
        exclude.push(hit.path_id);
      }
      if (!data.more || !data.hits?.length) break;
    }
    console.log(`[viewcounts] ${counts.size} paths loaded`);
  } catch (err) {
    console.warn("[viewcounts] GoatCounter API 실패; 조회수는 브라우저에서만 불러옵니다.", err);
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
