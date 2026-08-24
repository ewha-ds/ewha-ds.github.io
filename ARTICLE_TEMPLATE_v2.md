```md
---
# 글 제목
# ex) "AGENTIC AI"
title: "글 제목"

# 한 줄 설명
# ex) "챗봇을 넘어, 직접 행동하는 AI"
subtitle: "한 줄 설명"

# TECH / RESEARCH / CAREER 중 선택
category: "TECH"

# 작성자
author: "작성자 이름"

# 선택사항: GitHub / 개인 홈페이지
# 없으면 이 줄 삭제
authorUrl: "https://github.com/username"

# YYYY-MM-DD
date: 2026-09-02

# 글 한 줄 요약
description: "글의 핵심 내용을 한 문장으로 작성"

# Featured Visual
# ex) 26_09/AgentVisual.astro → "26_09_agent"
visual: "26_09_agent"

# 선택사항: 링크 공유용 이미지
# ex) /images/26_09/agentic-ai/og.png
# 없으면 이 줄 삭제 → default-og.png 사용
ogImage: "/images/26_09/post-name/og.png"

# 작성 중: true / 공개: false
draft: true
---

<!--
제목은 위 title이 자동 표시됩니다.
본문에서는 ##부터 작성하면 됩니다.
## 제목은 오른쪽 CONTENTS에 자동 표시됩니다.
-->


## 첫 번째 섹션

글의 도입부를 작성합니다.


## 핵심 개념

핵심 개념을 설명합니다.

중요한 내용은 **굵게**, 기술 용어는 `inline code`로 작성할 수 있습니다.


### 세부 개념

필요한 경우 ### 소제목을 사용합니다.


## 구조 또는 작동 방식

1. 입력
2. 처리 과정
3. 핵심 구조
4. 결과


## 이미지 또는 도식

이미지 저장 위치:

`public/images/YY_MM/post-name/`

본문에서는:

![이미지 설명](/images/YY_MM/post-name/image.png)


## 수식

문장 안 수식:

$E = mc^2$

블록 수식:

$$
\cos(\theta)
=
\frac{\mathbf{x}\cdot\mathbf{y}}
{\|\mathbf{x}\|\|\mathbf{y}\|}
$$


## 실제 활용 또는 예시

구체적인 활용 사례나 예시를 작성합니다.


## 한계 또는 주의점

필요한 경우 작성합니다.


## 정리

글의 핵심 내용을 짧게 정리합니다.


## References

1. [출처 제목](https://example.com)
2. [논문 또는 공식 문서](https://example.com)


<!--
파일 위치

글
TECH     → src/content/posts/tech/YY_MM/
RESEARCH → src/content/posts/research/YY_MM/
CAREER   → src/content/posts/career/YY_MM/

본문 / OG 이미지
→ public/images/YY_MM/post-name/

Featured Visual
→ src/components/visuals/YY_MM/

일반 작성자는 src/pages/, content.config.ts,
FeaturedVisual.astro 등 사이트 구조 파일을 수정하지 않습니다.
-->
```
