# EWHA DS Archive

이화여자대학교 데이터사이언스전공 학생회 학술 아카이브 · https://ewha-ds.github.io

> **글을 올리려는 거라면 이 문서가 아니라 [HANDOVER.md](./HANDOVER.md)를 보세요.**
> 이 문서는 사이트 구조를 수정하는 개발자용입니다.

## 구조

```
방문자        → ewha-ds.github.io (GitHub Pages)
운영자        → Pages CMS (app.pagescms.org) → 글 작성
저장          → ewha-ds GitHub Organization / 이 저장소
배포          → main push 시 GitHub Actions 자동 빌드·배포 (.github/workflows/deploy.yml)
```

- 프레임워크: Astro (정적 빌드), 수식: remark-math + rehype-katex
- 배포는 기본 `GITHUB_TOKEN` + `actions/deploy-pages`만 사용합니다. 개인 토큰에 의존하지 않도록 유지해주세요.

## 콘텐츠

```
src/content/posts/
├── tech/       YYYY-MM-DD-제목.md   (CMS가 자동 생성)
├── research/
└── career/
public/images/  본문·OG 이미지 (CMS 업로드 위치)
```

- 스키마: `src/content.config.ts`
- CMS 입력 화면: `.pages.yml`
- **두 파일의 필드는 항상 함께 수정**해야 합니다. 스키마에만 필수 필드를 추가하면 CMS로 올린 글에서 빌드가 깨집니다.
- 글 URL은 `/posts/{폴더}/{파일명}/` 입니다. 이미 공개된 글의 파일을 옮기거나 이름을 바꾸면 `astro.config.mjs`의 `redirects`에 옛 주소를 추가하세요.
- CMS는 삭제·이름 변경을 막아두었습니다 (`operations`). 글 삭제는 관리자가 GitHub에서 직접 합니다.
- 본문은 rich-text(Markdown 저장)입니다. 수식 등 에디터가 다루기 어려운 문법은 Source 모드 사용을 안내합니다.
- `category`는 CMS에서 폴더별로 고정값이 들어갑니다. 폴더와 category가 다르면 목록에서 사라져 보이니 직접 수정 시 주의.

## 공개 규칙과 예약 공개

공개 여부는 **`src/lib/posts.ts` 한 곳**에서만 판단합니다. 목록·상세·홈 모두 이 함수를 씁니다.

| draft | date | 상태 | 보이는 곳 |
| --- | --- | --- | --- |
| true | 무관 | 임시저장 | `/preview/` |
| false | 빌드 시각 이후 | 예약 | `/preview/` |
| false | 빌드 시각 이전 | 공개 | 사이트 전체 |

- `deploy.yml`의 `schedule`(매시 7분)로 다시 빌드해 예약 글을 공개합니다. GitHub 스케줄은 수십 분 지연될 수 있습니다.
- 빌드 단계에 `TZ: Asia/Seoul`이 있어야 `2026-09-25T09:00`이 한국 시간으로 해석됩니다. 지우면 9시간 늦게 공개됩니다.
- `date`에 초(`:00`)를 붙이지 마세요. YAML 파서에 따라 시간대 없이 UTC로 읽힐 수 있습니다. 날짜만(`2026-09-02`) 쓰면 한국 시간 오전 9시로 처리됩니다.
- 공개 저장소는 60일간 활동이 없으면 GitHub가 스케줄 실행을 자동 중지합니다. 예약 글을 저장하는 커밋 자체가 활동이라 보통 문제없지만, 두 달 이상 뒤 예약은 피합니다.
- 이 기능은 사이트 쪽에 있으므로 CMS를 교체해도 유지됩니다.

## 미리보기

임시저장·예약 글은 `/preview/{id}/` 로 빌드됩니다 (`src/pages/preview/`). 목록은 `/preview/`.
사이트 어디에도 링크되지 않고 `noindex`가 걸려 있습니다. 공개 글(`/posts/`)과 미리보기는 같은 레이아웃 `src/components/ArticlePage.astro` 를 씁니다.

## 권한 구조

| 역할 | 방식 | 할 수 있는 것 |
| --- | --- | --- |
| 관리자 (학생회장·학술국장 등) | `ewha-ds` 조직 멤버 (GitHub 계정) | CMS 전체 + 편집자 초대 + GitHub에서 삭제·설정 |
| 편집자 (학술국원) | Pages CMS Collaborator (이메일 초대, GitHub 계정 불필요) | 글 작성·수정·이미지 업로드 |

## Featured Visual (홈 대표 도식) 추가

1. `src/components/visuals/YY_MM/이름Visual.astro` 생성
2. 키가 자동 생성됨: `26_10/AttentionMechanismVisual.astro` → `26_10_attention_mechanism`
   (`common/` 폴더는 접두사 없이 `research`, `career`)
3. **`.pages.yml`의 `visual` 선택지에 키 추가** (안 하면 CMS에서 고를 수 없음)

visual이 없는 글은 RESEARCH/CAREER는 공통 도식, TECH는 기본 EWHA DS 화면이 표시됩니다 (`src/pages/index.astro`).

## 개발

```sh
npm install
npm run dev      # localhost:4321
npm run build
```

Node 22 이상 (`package.json` engines, 워크플로우도 Node 22).

## 연 1회 점검

- [ ] `npm run build`가 로컬에서 통과하는지
- [ ] Actions의 Node 버전·액션 버전(`checkout`, `setup-node`, `upload-pages-artifact`, `deploy-pages`) 지원 종료 공지 확인
- [ ] 빌드가 깨져도 기존 배포본은 계속 서비스되므로, 급하게 고치지 말고 원인 확인 후 수정

## 수동 작성 (CMS를 쓸 수 없을 때)

`ARTICLE_TEMPLATE.md`를 참고해 `src/content/posts/{카테고리}/`에 직접 파일을 추가합니다. (비개발자용 절차는 HANDOVER.md "CMS가 아예 안 열려요")

## CMS 교체 (Pages CMS 서비스 중단 시)

### 원칙

```
후임자 → [GUI CMS] → Markdown + frontmatter → Astro → GitHub Pages
              ↑ 교체 가능한 부품
```

- 목표는 "Pages CMS 유지"가 아니라 **"비개발자용 GUI CMS가 항상 있는 상태" 유지**.
- CMS와 사이트를 결합하지 않는다. CMS는 frontmatter와 본문만 편집하고, 콘텐츠 파일에 특정 CMS 전용 문법을 넣지 않는다.
- `.pages.yml`에 커스텀 기능(액션, 외부 연동 등)을 늘리지 않는다. 늘릴수록 교체 비용이 커진다.
- 자체 서버 운영(self-host)은 서버·DB·인증·보안 업데이트 관리 부담이 생기므로 최후의 수단.

### 교체 시 유지해야 할 콘텐츠 규칙

| 항목 | 규칙 |
| --- | --- |
| 저장 경로 | `src/content/posts/{tech,research,career}/{urlKey}.md` |
| 카테고리 | 폴더별 고정값 `TECH` / `RESEARCH` / `CAREER` (편집자가 고르지 않게) |
| 필수 | `title`, `subtitle`, `urlKey`, `author`, `date`(`YYYY-MM-DDTHH:mm`, 한국 시간, 초·시간대 없이), 본문 |
| 선택 | `authorUrl`(https URL), `description`, `ogImage`, `visual`(기존 키 중 선택) |
| 공개 여부 | `draft` 불리언. 새 글 기본값 `true` (스키마 기본값도 true). 미래 `date` + `draft: false` = 예약 |
| 본문 | 일반 Markdown. 수식은 `$...$`, `$$...$$` |
| 이미지 | 저장 `public/images/`, 본문 경로 `/images/파일명`, 파일명 무작위 |
| 금지 | 글 삭제·이름 변경은 CMS에서 막기. frontmatter 키 이름으로 `slug` 사용 금지(Astro가 id로 사용해 URL이 바뀜) |

### 선택지 (권장 순)

1. **Sveltia CMS** (Decap CMS 호환, 오픈소스, 무료)
   - 관리 화면을 이 저장소 안 `public/admin/`에 정적 파일로 두는 방식이라 외부 CMS 서비스에 의존하지 않음.
   - GitHub 로그인이 필요해 **편집자도 GitHub 계정 + 조직 초대**가 필요.
   - 비개발자 로그인에는 Cloudflare Workers(무료)에 공식 인증 스크립트(sveltia-cms-auth) 배포가 필요. GitHub가 서버 없는 로그인 방식을 지원하면 불필요해질 예정이므로 교체 시점에 공식 문서 확인.
   - 위 표의 규칙을 `config.yml`의 collections/fields로 옮기면 됨. 사이트 코드는 수정 불필요.
2. **Decap CMS**: 1과 같은 구조. 1이 막힐 때의 대안.
3. **Pages CMS 직접 설치** (MIT): `.pages.yml`을 그대로 쓸 수 있지만 서버·DB 운영이 필요해 후임자 부담이 큼. 최후의 수단.

교체 후 할 일: `HANDOVER.md`의 "글 올리기" 절차 갱신, 편집자 재초대, 블라인드 테스트 1회.
