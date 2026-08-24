```md
---
# ==================================================
# EWHA DS ARTICLE TEMPLATE
# ==================================================

# 글 제목
# ex) "AGENTIC AI"
title: "글 제목 입력"

# 제목 아래 한 줄 설명
# ex) "챗봇을 넘어, 직접 행동하는 AI"
subtitle: "한 줄 설명 입력"

# 카테고리 선택
# 아래 3개 중 하나만 사용
# TECH     : AI / 데이터사이언스 기술 및 최신 동향
# RESEARCH : 논문 리뷰 / 연구 소개 / 학술 콘텐츠
# CAREER   : 대학원 / 산업 / 진로 / 커리어
# ex) category: "TECH"
category: "TECH"

# 작성자 이름
# ex) author: "Minseon Son"
author: "작성자 이름"

# 작성자 GitHub / 개인 홈페이지
# 선택사항
# 없는 경우 이 줄 자체를 삭제해도 됨
# 반드시 https:// 로 시작하는 실제 URL 사용
# ex) authorUrl: "https://github.com/username"
authorUrl: "https://github.com/username"

# 게시일
# 형식: YYYY-MM-DD
# ex) date: 2026-09-02
date: 2026-09-00

# 글 내용을 한 문장으로 요약
# 검색 결과 및 링크 공유 설명에 사용
# ex) "AI Agent의 핵심 개념과 구조를 살펴봅니다."
description: "글의 핵심 내용을 한 문장으로 입력"

# 홈 Featured Article 오른쪽 도식
#
# 월별 Visual 파일의 이름에 따라 자동 연결됨
#
# ex)
# src/components/visuals/26_09/AgentVisual.astro
# → visual: "26_09_agent"
#
# src/components/visuals/26_09/RagVisual.astro
# → visual: "26_09_rag"
#
# src/components/visuals/26_10/AttentionMechanismVisual.astro
# → visual: "26_10_attention_mechanism"
#
# common 폴더 예시
# common/ResearchVisual.astro
# → visual: "research"
#
# 아직 사용할 도식이 정해지지 않았다면
# 사이트 관리자에게 문의
visual: "YY_MM_visual_name"

# 링크 공유용 대표 이미지
# 선택사항
#
# 이미지 위치 예시:
# public/images/26_09/agentic-ai/og.png
#
# Frontmatter에서는 public을 제외하고 작성
# ex) ogImage: "/images/26_09/agentic-ai/og.png"
#
# 전용 이미지가 없으면 이 줄 자체를 삭제
# → 자동으로 default-og.png 사용
ogImage: "/images/YY_MM/post-name/og.png"

# 공개 여부
#
# 작성 중
# draft: true
#
# 최종 공개
# draft: false
draft: true
---

<!--
==================================================
본문 작성 시작
==================================================

주의:
- 글 제목은 위 title이 자동으로 Hero에 표시됩니다.
- 본문에 # 제목을 다시 작성할 필요 없습니다.
- ## 제목은 오른쪽 CONTENTS에 자동 등록됩니다.
- ### 는 하위 소제목으로 사용합니다.
-->


## 첫 번째 섹션 제목

글의 도입부를 작성합니다.

가능하면 이 글에서 다룰 핵심 질문이나 문제를 먼저 제시합니다.

예:

> 기존 LLM은 사용자의 질문에 답하는 데 집중했다.  
> 그렇다면 AI가 직접 계획을 세우고 도구를 사용해 작업까지 수행하려면 무엇이 필요할까?


## 핵심 개념

핵심 개념을 설명합니다.

중요한 용어는 **굵게** 표시할 수 있습니다.

코드나 기술 용어는 `inline code` 형태로 사용할 수 있습니다.


### 세부 개념

필요한 경우 `###` 하위 제목을 사용합니다.

`###` 제목은 오른쪽 CONTENTS에는 표시되지 않습니다.


## 구조 또는 작동 방식

가능하면 다음 흐름으로 설명합니다.

1. 입력
2. 처리 과정
3. 핵심 구조
4. 출력 또는 결과

필요하면 목록을 사용할 수 있습니다.

- 첫 번째 요소
- 두 번째 요소
- 세 번째 요소


## 이미지 또는 도식

본문 이미지는 아래 위치에 저장합니다.

public/images/YY_MM/post-name/

예:

public/images/26_09/agentic-ai/architecture.png

Markdown에서는 `public`을 제외하고 작성합니다.

예:

![이미지 설명](/images/26_09/agentic-ai/architecture.png)

이미지는 단순 장식보다
개념 이해에 도움이 되는 구조도, 흐름도, 결과 이미지 등을 권장합니다.


## 수식

문장 안에 짧게 넣는 수식:

$E = mc^2$

블록 수식:

$$
\cos(\theta)
=
\frac{\mathbf{x}\cdot\mathbf{y}}
{\|\mathbf{x}\|\|\mathbf{y}\|}
$$

수식은 가능하면 다음 순서로 설명합니다.

개념 설명
→ 수식
→ 기호 설명
→ 직관적 해석


## 실제 활용 또는 예시

기술이나 연구가 실제로 어디에서 사용되는지 설명합니다.

가능하면 구체적인 사례를 포함합니다.


## 한계 또는 주의점

기술의 한계, 오해하기 쉬운 부분, 적용 시 주의점을 작성합니다.

필요하지 않은 글에서는 이 섹션을 생략해도 됩니다.


## 정리

글의 핵심 내용을 짧게 정리합니다.

새로운 정보를 추가하기보다
앞에서 설명한 내용을 다시 연결해주는 방식으로 작성합니다.


## References

1. [출처 제목](https://example.com)
2. [논문 또는 공식 문서 제목](https://example.com)
3. [추가 참고자료](https://example.com)

<!--
==================================================
파일 저장 위치 참고
==================================================

TECH 글:
src/content/posts/tech/YY_MM/post-name.md

RESEARCH 글:
src/content/posts/research/YY_MM/post-name.md

CAREER 글:
src/content/posts/career/YY_MM/post-name.md


본문 이미지 / OG 이미지:
public/images/YY_MM/post-name/


Featured Visual:
src/components/visuals/YY_MM/


예시)

글:
src/content/posts/tech/26_09/agentic-ai.md

Featured Visual:
src/components/visuals/26_09/AgentVisual.astro

본문 이미지:
public/images/26_09/agentic-ai/architecture.png

OG 이미지:
public/images/26_09/agentic-ai/og.png


일반 작성자는 아래 구조 파일을 수정하지 않습니다.

src/pages/
src/content.config.ts
astro.config.mjs

src/components/Header.astro
src/components/Footer.astro
src/components/SEO.astro
src/components/visuals/FeaturedVisual.astro
==================================================
-->
```
