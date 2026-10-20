---
category: TECH
title: FINE TUNING
subtitle: 모두를 위한 AI를 넘어, 나를 위한 AI로
urlKey: fine-tuning
author: Yujin Shin
date: 2026-10-20T18:57
draft: false
---
### 들어가며

안녕하세요, 이화여자대학교 데이터사이언스전공 제4대 학생회 피움입니다.

과제를 해결하거나 까다로운 전공 개념을 공부할 때, 자연스럽게 ChatGPT 같은 생성형 AI를 켜본 경험이 다들 한 번쯤 있으실 겁니다. 꽤 그럴듯하게 문장을 완성해 내지만, 정작 우리가 필요로 하는 정교한 이론이나 전문적인 디테일 앞에서는 두루뭉술하게 얼버무리거나 엉뚱한 답을 내놓아 아쉬웠던 순간도 적지 않았을 텐데요. 세상의 방대한 데이터를 두루 학습한 '만능형' 범용 모델이기에, 역설적으로 특정 도메인의 깊이 있는 전문성까지 온전히 담아내기란 쉽지 않기 때문입니다.

그렇다면 이미 방대한 언어적 직관을 갖춘 모델에게 우리가 원하는 전문 지식의 깊이를 더해주는 방법은 무엇일까요? 이번 정기간행물에서는 범용 모델을 특정 분야의 든든한 전문가로 다시 가르쳐 쓰는 핵심 기술, **전이학습(Transfer Learning)**과 **파인튜닝(Fine-tuning)**을 깊이 있게 다루어보고자 합니다.

## 1. 전이학습의 등장: 왜 처음부터 배우지 않을까?

ChatGPT와 같은 거대 언어모델(LLM)이 일상에 자리 잡았지만, 이런 모델을 처음부터 만드는 일은 아무나 할 수 있는 일이 아닙니다. 2020년에 공개된 GPT-3만 해도 파라미터가 1,750억 개에 이릅니다. 이 정도 모델을 처음부터 학습하려면 방대한 데이터와 컴퓨팅 자원, 그리고 오랜 시간이 필요합니다. 대학 연구실이나 학생 프로젝트팀이 감당하기는 현실적으로 어렵습니다.

그렇다면 이미 누군가 막대한 비용을 들여 학습시켜 둔 모델의 지식을 가져다 쓸 수는 없을까요?

이 질문에서 출발한 것이 바로 **전이학습**입니다.데이터사이언스 전공 학생이 '머신러닝'을 처음 배우는 상황을 떠올려 봅시다. 이 학생은 이미 미적분과 선형대수, 파이썬 문법을 익히고 데이터를 다루는 기본기를 쌓아 둔 상태입니다. 그래서 '머신러닝'이라는 새로운 과목만 추가로 익히면 됩니다. 만약 과목이 바뀔 때마다 파이썬 문법이나 미적분부터 다시 배워야 한다면 얼마나 비효율적일까요? 전이학습은 AI가 바로 이런 방식으로 공부하게 만드는 방법입니다.

![image.png](/images/mvgiq04p-pg3skbhh.png)

*그림 1. 처음부터 학습하는 방식과 전이학습의 차이 (출처 : 직접 제작)*

즉, 전이학습의 핵심은 한 문장으로 정리할 수 있습니다.

> **“처음부터 배우지 않고, 이미 배운 지식에서 출발하는 학습 방식”**

이 글에서는 전이학습의 개념을 먼저 짧게 짚은 뒤, 오늘날 가장 널리 쓰이는 전이학습 방법인 **LLM 파인튜닝**을 중심으로 살펴보겠습니다. 파인튜닝이 어떤 방식으로 이루어지는지, 실제로 어떤 변화를 만들어 냈는지, 그리고 왜 여전히 원리를 알아야 하는지와 어떤 한계와 법적 쟁점이 있는지를 차례대로 다룹니다.

## 2. 전이학습과 파인튜닝은 어떻게 작동할까?

### 2.1 전이학습: 배운 지식을 옮겨 쓰기

전이학습(transfer learning)은 한 과제에서 얻은 지식을 다른 과제를 푸는 데 활용하는 방법입니다(Pan & Yang, 2010). 이 글에서 자주 나올 용어를 먼저 정리해 보겠습니다.

- **사전학습(pre-training)**: 방대한 일반 데이터로 모델을 먼저 학습하는 단계
- **하위 과제(downstream task)**: 우리가 실제로 풀고 싶은 구체적인 문제 (예: 판결문 요약)
- **파인튜닝(fine-tuning)**: 사전학습된 모델을 하위 과제의 데이터로 추가 학습해 조정하는 과정

개념적으로는 전이학습이 더 큰 틀이고, 파인튜닝은 그 아래에서 전이학습을 구현하는 대표적인 방법입니다.

전이학습은 하루아침에 등장한 기술이 아닙니다.

- **이미지 분야**: Yosinski 등(2014)은 신경망의 앞쪽 층이 배우는 특징(모서리나 질감 같은 기초적인 패턴)이 과제와 무관하게 범용적이어서 다른 과제로 옮겨 쓸 수 있다는 것을 실험으로 보였습니다.
- **언어 분야**: Howard와 Ruder(2018)는 언어모델을 먼저 사전학습한 뒤 파인튜닝하는 방식을 텍스트 분류에 적용해 여러 과제에서 당시 최고 성능을 넘어섰습니다. 이어 등장한 BERT(Devlin et al., 2019)는 “대규모 사전학습 후 과제별 파인튜닝”을 자연어처리의 표준 절차로 자리 잡게 한 계기가 되었습니다.

### 2.2 LLM은 어떤 단계를 거쳐 만들어질까?

우리가 쓰는 대화형 LLM은 보통 아래 세 단계를 거칩니다. OpenAI가 InstructGPT에서 정립한 방식이 대표적입니다(Ouyang et al., 2022).

![image.png](/images/mvgiqnj4-fzfz80lo.png)

*그림 2. LLM이 만들어지는 세 단계 (출처 : Ouyang et al., 2022의 내용을 바탕으로 직접 제작)*

1. **사전학습**: 인터넷 규모의 텍스트로 “다음에 올 단어 맞히기”를 반복하며 언어 능력과 지식을 쌓습니다. 그런데 이 목표는 “사용자의 지시를 유용하고 안전하게 따르기”와는 다릅니다. 사전학습만 마친 모델은 질문에 답하는 대신 비슷한 문장을 이어 쓰기도 합니다.
2. **지도 파인튜닝(SFT, Supervised Fine-Tuning)**: 사람이 직접 작성한 질문과 모범 답안 쌍으로 모델을 추가 학습시킵니다. “이런 질문에는 이렇게 답한다”는 시범을 보여 주는 단계입니다.
3. **선호도 정렬(RLHF, 인간 피드백 기반 강화학습)**: 모델이 만든 여러 답변을 사람이 순위 매기고, 그 선호를 학습해 모델을 한 번 더 조정합니다.

> 사전학습이 모델에게 ’지식’을 쌓아 준다면, 파인튜닝은 그 지식을 ’어떻게 쓸지’를 가르칩니다.

이 표현은 뒤에서 살펴볼 연구들(Zhou et al., 2023; Gekhman et al., 2024)의 결론과도 맞닿아 있습니다.

### 2.3 파인튜닝의 방식: 전체 파인튜닝, LoRA, QLoRA

파인튜닝에는 크게 세 가지 방식이 있습니다.

**① 전체 파인튜닝**

모델의 모든 파라미터를 다시 학습하는 가장 직관적인 방법입니다. 하지만 모델이 커질수록 학습에 드는 자원도, 완성된 모델을 저장하고 배포하는 비용도 함께 커집니다. LoRA 논문은 GPT-3 175B를 예로 들어, 용도별로 175B짜리 모델 사본을 따로 운영하는 것이 너무 비싸다는 문제의식에서 출발했습니다(Hu et al., 2022).

**② LoRA (Low-Rank Adaptation)**

LoRA는 원래 모델의 가중치(W)는 **그대로 얼려 두고**, 각 층에 작은 행렬 두 개(B, A)를 덧붙여 이 작은 행렬만 학습합니다. 학습이 끝나면 모델은 `W + B·A`처럼 원래 가중치에 작은 보정값이 더해진 형태로 동작합니다.

![image.png](/images/mvgiqzus-m5fhh4nx.png)

*그림 3. LoRA의 구조 (출처 : Hu et al., 2022의 내용을 바탕으로 직접 제작)*

비유하자면, 두꺼운 교과서(원래 모델)는 그대로 두고 필요한 곳에 **얇은 포스트잇(LoRA)** 만 붙여 내용을 보완하는 방식입니다. 과목이 바뀌면 교과서는 그대로 두고 포스트잇만 바꿔 끼우면 됩니다.

효과는 수치로도 확인됩니다. 원 논문에 따르면 GPT-3 175B를 Adam으로 전체 파인튜닝하는 것과 비교해, LoRA는 **학습해야 하는 파라미터 수를 약 1만 분의 1로, GPU 메모리 요구량을 약 3분의 1로** 줄였습니다. 그런데도 RoBERTa, DeBERTa, GPT-2, GPT-3에서 모델 품질은 전체 파인튜닝과 같거나 더 좋았고, 추론 시 추가 지연도 없었습니다. 이는 모델을 적응시키는 데 필요한 변화가 생각보다 단순한 구조(낮은 rank)를 가진다는 관찰에 기반합니다.

**③ QLoRA**

QLoRA는 LoRA에 **양자화(quantization)** 를 더한 방식입니다. 원래 모델을 4비트로 압축해 메모리를 아낀 채 얼려 두고, 그 위에 LoRA를 학습합니다(Dettmers et al., 2023). 이 방법으로 650억 파라미터 모델을 48GB GPU 한 장에서 파인튜닝할 수 있었고, 연구진이 만든 Guanaco 모델은 Vicuna 벤치마크에서 ChatGPT 대비 99.3% 수준의 성능을 보였습니다. 학습에는 단일 GPU로 24시간이 걸렸습니다.


| 방식 | 학습하는 대상 | 자원 | 특징 |
| ------- | ------------------- | ------------------------------------- | ------------------------- |
| 전체 파인튜닝 | 모든 파라미터 | 매우 큼 | 용도별로 모델 사본이 필요 |
| LoRA | 덧붙인 작은 행렬 | 작음 (GPT-3 175B 기준 학습 파라미터 약 1/10,000) | 추론 지연 없음, 품질은 전체 파인튜닝과 대등 |
| QLoRA | 4비트로 압축한 모델 위의 LoRA | 더 작음 (65B 모델을 48GB GPU 1장에서) | 소규모 환경에서도 큰 모델 조정 가능 |


## 3. 파인튜닝이 가져온 변화: 실제 사례

### 3.1 InstructGPT: 작은 모델이 100배 큰 모델을 이기다

파인튜닝의 위력을 가장 극적으로 보여 준 사례는 OpenAI의 **InstructGPT**입니다. 연구진은 GPT-3를 사람이 쓴 시범 답안으로 파인튜닝(SFT)하고, 사람의 순위 평가로 다시 강화학습(RLHF)했습니다.

결과는 인상적이었습니다. 사용자 프롬프트 분포에 대한 사람 평가에서 **13억 파라미터 InstructGPT의 답변이 1,750억 파라미터 GPT-3의 답변보다 더 선호**되었습니다. 파라미터가 100배 적은데도 앞선 것입니다. 진실성은 개선되고 유해한 출력은 줄었으며, 공개 NLP 벤치마크에서의 성능 저하는 최소한이었습니다.

> 모델의 크기만큼이나, 모델을 **어떻게 맞춰 주느냐**가 중요하다는 것을 보여 준 사례입니다.

### 3.2 의료와 법률: 전문 분야에 맞추는 파인튜닝

일반 LLM을 전문 분야에 맞추는 시도도 활발합니다.

**의료 (Med-PaLM)**

Google 연구진은 Nature(2023)에 실린 연구에서 PaLM(5,400억 파라미터)을 지시문으로 파인튜닝한 Flan-PaLM이 미국 의사 면허시험 형식의 문제(MedQA)에서 67.6% 정확도로 기존 최고 성능을 17% 넘게 앞섰다고 보고했습니다. 여기에 소수의 예시로 모델을 새 분야에 맞추는 **instruction prompt tuning**을 적용해 의료 특화 모델 Med-PaLM을 만들었습니다. 다만 논문은 이 모델이 여전히 임상의보다 부족하다는 점도 분명히 밝히고 있습니다.

**법률 (SaulLM-7B)**

법률 분야에서는 SaulLM-7B(Colombo et al., 2024)가 대표적입니다. Mistral 7B 모델을 약 300억 토큰 규모의 영어 법률 말뭉치로 추가 학습하고, 일반 지시 데이터와 법률 지시 데이터로 다시 파인튜닝했습니다. 그 결과 법률 과제 모음인 LegalBench-Instruct에서 당시 최고 수준의 오픈소스 지시 모델보다 약 11% 상대적으로 높은 성능을 기록했습니다.

두 사례 모두 일반 모델 위에 전문 데이터를 얹어 **“범용 모델을 우리 분야의 모델로”** 바꾼다는 점에서 전이학습의 전형입니다. 동시에 의료·법률처럼 오류의 비용이 큰 분야에서는 평가와 안전성 검증이 함께 강조된다는 점도 눈여겨볼 만합니다.

### 3.3 Alpaca, LIMA: 누구나 시도할 수 있게 된 파인튜닝

파인튜닝은 거대 기업만의 영역이 아니게 되었습니다.

- **Alpaca (Stanford, 2023)**: Meta의 LLaMA 7B 모델을 5만 2천 개의 지시 데이터로 파인튜닝했습니다. 연구진은 총 비용이 600달러 미만이라고 밝혔고, 파인튜닝 자체는 A100 80GB GPU 8장으로 약 3시간이 걸렸으며 클라우드 비용으로는 100달러 미만이었다고 알려져 있습니다.
- **LIMA (Meta 등, 2023)**: 650억 파라미터 LLaMA를 **엄선한 단 1,000개**의 질문-답변으로 파인튜닝했습니다. 사람 평가에서 GPT-4 답변과 동등하거나 더 선호된 비율이 43%였습니다. 연구진은 LLM의 지식 대부분이 사전학습에서 만들어지고, 좋은 답변을 내게 하는 데는 많지 않은 양의 고품질 데이터면 충분할 수 있다고 해석했습니다.
- **QLoRA**: 앞서 본 것처럼 코드가 공개되어 있어, 모델 크기를 줄이면 더 작은 GPU로도 직접 시도해 볼 수 있습니다(필요한 사양은 모델과 설정에 따라 다릅니다).

한 가지 눈여겨볼 점은 라이선스입니다. Alpaca는 연구 목적으로만 쓰도록 공개되었는데, LLaMA의 비상업 라이선스와 학습 데이터를 만든 OpenAI 모델의 이용약관(경쟁 모델 개발 금지)이 이유였습니다. 파인튜닝에서 ’어떤 모델과 데이터를 쓰는가’는 기술만의 문제가 아니라는 것을 보여 주는 사례이며, 5장에서 다시 다루겠습니다.

## 4. 그럼에도 파인튜닝을 알아야 하는 이유

“프롬프트만 잘 써도 되고, 필요하면 외부 문서를 붙이면 되는데 굳이 파인튜닝까지?”라고 생각할 수 있습니다. 그러나 목적에 맞는 방법을 고르려면 각 방법이 무엇을 바꾸는지 알아야 합니다.

### 4.1 프롬프트와 RAG로는 부족한 순간

- 매번 지시문에 길게 적어도 일관되게 지켜지지 않는 **답변 형식, 말투, 업무 규칙**을 모델이 기본 습관으로 갖게 하고 싶을 때
- 도메인 특유의 용어와 표현에 모델을 맞추고 싶을 때

LIMA 연구에서 모델이 소수의 예시만으로도 특정 답변 형식을 익혔다는 점은, 파인튜닝이 이런 ‘행동 양식’ 조정에 효율적일 수 있음을 보여 줍니다.

### 4.2 반대로, 파인튜닝이 만능은 아니다

흔히 “우리 회사 데이터를 파인튜닝해서 지식을 넣자”고 생각하지만, 연구 결과는 이 접근에 신중함을 요구합니다.

- Ovadia 등(2024)은 새로운 지식을 모델에 주입할 때 **검색 증강 생성(RAG, 외부 문서를 찾아 답변에 활용하는 방식)이 비지도 파인튜닝을 일관되게 앞섰다**고 보고했습니다. 모델이 파인튜닝만으로는 새로운 사실을 잘 배우지 못했다는 것입니다.
- Gekhman 등(2024)은 파인튜닝으로 새로운 사실을 가르칠 때 모델이 이를 **천천히 학습**하며, 학습이 이루어질수록 오히려 **환각(그럴듯한 거짓 답변) 경향이 커진다**고 보고했습니다. 이들은 LLM이 사실 지식을 주로 사전학습에서 얻고, 파인튜닝은 그 지식을 더 잘 활용하도록 가르친다고 해석했습니다.

정리하면 **지식은 RAG, 행동 양식은 파인튜닝**이라는 구분이 중요한 기준이 됩니다. 일반적으로 아래와 같이 비교할 수 있습니다.


| 구분 | 프롬프트 엔지니어링 | RAG | 파인튜닝 |
| ----- | --------------- | --------------- | ------------------- |
| 바꾸는 것 | 입력 지시문 | 답변에 붙이는 참고 자료 | 모델의 파라미터 |
| 잘하는 일 | 빠른 시도, 간단한 과제 | 최신·외부 지식, 근거 제시 | 일관된 형식·말투, 전문 분야 행동 |
| 지식 갱신 | 매번 입력 | 문서만 교체하면 됨 | 다시 학습해야 함 |
| 주의할 점 | 규칙이 항상 지켜지지는 않음 | 검색 품질에 좌우됨 | 데이터·비용, 망각, 안전성 |


※ 위 표는 일반적인 경향을 정리한 것이며, 실제로는 세 방법을 함께 쓰는 경우가 많습니다.

### 4.3 결국 데이터가 결정한다

LIMA가 보여 주듯 파인튜닝의 성패는 데이터의 **양보다 품질**에 크게 좌우됩니다. 또한 파인튜닝 데이터가 실제 사용 환경과 다르면 성능이 떨어지는 **도메인 시프트(domain shift)** 문제도 생깁니다. 어떤 데이터로 어떤 목적에 맞출 것인지 설계하고, 결과를 평가하고, 문제의 원인을 진단하려면 파인튜닝의 원리에 대한 이해가 필요합니다.

## 5. 파인튜닝의 한계와 안전하게 활용하는 법

### 5.1 새로 배우다 기존 지식을 잃는다: 파국적 망각

시험 기간에 한 과목만 벼락치기하다 보면 다른 과목 내용이 흐려지는 경험이 있을 것입니다. 모델도 비슷합니다. 이를 **파국적 망각(catastrophic forgetting)** 이라고 합니다. Luo 등(2023)은 1B~7B 규모의 LLM을 대상으로 한 실험에서 새 지시 데이터로 계속 파인튜닝할수록 기존 지식과 능력이 떨어지는 망각 현상이 전반적으로 관찰되며, 이 규모 범위에서는 모델이 클수록 망각이 더 심해졌다고 보고했습니다. 한편 일반 지시 튜닝을 거친 모델(Alpaca)이 그렇지 않은 모델(LLaMA)보다 망각이 덜했다는 점은 **일반 데이터를 함께 쓰는 것**이 완화책이 될 수 있음을 시사합니다. SaulLM-7B가 일반 지시 데이터와 법률 지시 데이터를 섞어 학습한 것도 같은 맥락입니다.

### 5.2 새로운 지식과 환각

4장에서 본 것처럼 파인튜닝으로 새로운 사실을 넣으려는 시도는 환각 위험을 키울 수 있습니다(Gekhman et al., 2024). 최신 정보나 정확한 근거가 필요한 용도라면 RAG를 우선 고려하는 편이 안전합니다.

### 5.3 안전장치가 약해질 수 있다

가장 눈에 띄는 한계는 **안전성**입니다. Qi 등(2023)은 안전 정렬이 잘 되어 있는 모델도 파인튜닝만으로 안전장치가 무너질 수 있다는 것을 보였습니다. 연구진은 GPT-3.5 Turbo를 **단 10개의 적대적으로 설계한 예시로, 0.2달러도 안 되는 비용**으로 파인튜닝해 거의 모든 유해한 지시에 응답하게 만들었습니다. 이 논문의 제목처럼, 사용자가 의도하지 않았더라도 파인튜닝이 안전성을 해칠 수 있다는 점이 핵심입니다. 따라서 파인튜닝 후에는 성능뿐 아니라 **안전성도 반드시 다시 평가**해야 합니다.

### 5.4 데이터와 법: 개인정보, 저작권, 라이선스

**개인정보**

Carlini 등(2021)은 GPT-2에서 학습 데이터에 포함된 문장을 **그대로 추출**하는 공격이 가능하다는 것을 보였습니다. 이름, 전화번호, 이메일 주소 같은 개인정보도 포함되어 있었고, 모델이 클수록 더 취약했습니다. 이 연구는 사전학습 모델을 대상으로 했지만, 파인튜닝에 개인정보가 섞인 데이터를 쓸 때도 같은 유형의 위험을 염두에 두어야 합니다.

개인정보보호위원회는 2025년 8월 「생성형 AI 개발·활용을 위한 개인정보 처리 안내서」를 공개했습니다. 이 안내서는 LLM 기반 AI 개발 방식을 ① 서비스형 LLM 활용, ② 기성 LLM(공개 모델) 활용, ③ 자체 개발로 나누고, 공통적으로 개인정보 안심설계(Privacy by Design)를 반영할 것과 대규모이거나 민감한 정보를 다룰 때 개인정보 영향평가를 실시할 것을 권고합니다. 공개 모델을 가져와 파인튜닝하는 방식은 이 중 ’기성 LLM 활용’에 가깝습니다. 학습 단계에서 입·출력 필터를 활용하라는 내용도 담겨 있습니다.

**저작권**

AI 학습에 저작물을 쓰는 것이 허용되는지는 뜨거운 쟁점입니다. 문화체육관광부와 한국저작권위원회는 2026년 2월 「생성형 AI의 저작물 학습에 대한 저작권법상 공정이용 안내서」를 발간했습니다. 이 안내서는 공정이용 여부를 **이용 목적 및 성격, 저작물의 종류와 용도, 전체에서 차지하는 비중, 시장에 미치는 영향**이라는 네 가지 요소로 종합 판단하도록 안내합니다. 상업적 목적이나 자동화된 웹 크롤링이라는 이유만으로 공정이용에서 배제하지는 않습니다. 다만 안내서의 사례는 공식 유권해석이 아니며, 최종 판단은 구체적인 사실관계에 따라 달라집니다.

**라이선스**

앞서 본 Alpaca처럼, 공개 모델도 상업적 이용 가능 여부가 라이선스마다 다르고, 다른 모델의 출력으로 학습 데이터를 만들 때는 그 서비스의 이용약관도 확인해야 합니다.

**AI 기본법**

2026년 1월 22일부터 시행된 「인공지능 발전과 신뢰 기반 조성 등에 관한 기본법(AI 기본법)」도 관련이 있습니다. 이 법은 생성형 AI를 활용한 서비스에 대해 **투명성 확보 의무**(제31조)를 두어 AI 적용 사실을 이용자에게 사전에 고지하고 생성물을 표시하도록 하며, 채용·대출 심사 등 **고영향 AI**에는 사전 검토와 함께 위험관리방안, AI 설명 방안, 이용자 보호 방안, 사람의 관리·감독 같은 안전성·신뢰성 확보 조치를 요구합니다(제33조~제35조). 파인튜닝한 모델을 이런 영역에 적용한다면 고영향 AI에 해당할 수 있으므로, 개발 단계부터 이 의무를 고려해야 합니다.

## 6. 마치며

전이학습은 “좋은 AI를 만들려면 처음부터 모든 것을 배워야 한다”는 전제를 바꾸었습니다. 앞서 다룬 연합학습이 **데이터를 모으지 않고도 함께 학습하는 방법**이었다면, 파인튜닝은 **이미 학습된 모델을 가져와 우리의 목적에 맞게 조정하는 방법**입니다.

InstructGPT는 작은 모델도 잘 맞추면 훨씬 큰 모델보다 선호될 수 있음을, LoRA와 QLoRA는 그 조정을 적은 자원으로도 할 수 있음을, LIMA는 데이터의 양보다 품질이 중요할 수 있음을 보여 주었습니다. 동시에 망각, 환각, 안전성 저하, 개인정보·저작권·라이선스 문제라는 그림자도 함께 드러났습니다.

> 결국 파인튜닝의 경쟁력은 모델을 처음부터 만드는 능력이 아니라, 이미 있는 모델을 **성능·비용·안전성·법적 책임 사이의 균형 속에서 적응시키는 설계 능력**에 달려 있다고 평가할 수 있습니다.

AI를 ’쓰는 사람’에서 ’맞추는 사람’으로 한 걸음 나아가고 싶은 분들께 이번 글이 작은 출발점이 되길 바랍니다.

## References

[1] Brown, T. B., Mann, B., Ryder, N., Subbiah, M., et al. (2020). Language Models are Few-Shot Learners. *Advances in Neural Information Processing Systems (NeurIPS)*, 33. [https://arxiv.org/abs/2005.14165](https://arxiv.org/abs/2005.14165)

[2] Pan, S. J., & Yang, Q. (2010). A Survey on Transfer Learning. *IEEE Transactions on Knowledge and Data Engineering*, 22(10), 1345–1359. [https://doi.org/10.1109/TKDE.2009.191](https://doi.org/10.1109/TKDE.2009.191)

[3] Yosinski, J., Clune, J., Bengio, Y., & Lipson, H. (2014). How transferable are features in deep neural networks? *Advances in Neural Information Processing Systems (NeurIPS)*, 27. [https://arxiv.org/abs/1411.1792](https://arxiv.org/abs/1411.1792)

[4] Howard, J., & Ruder, S. (2018). Universal Language Model Fine-tuning for Text Classification. *Proceedings of the 56th Annual Meeting of the Association for Computational Linguistics (ACL)*. [https://arxiv.org/abs/1801.06146](https://arxiv.org/abs/1801.06146)

[5] Devlin, J., Chang, M.-W., Lee, K., & Toutanova, K. (2019). BERT: Pre-training of Deep Bidirectional Transformers for Language Understanding. *Proceedings of NAACL-HLT 2019*. [https://arxiv.org/abs/1810.04805](https://arxiv.org/abs/1810.04805)

[6] Ouyang, L., Wu, J., Jiang, X., Almeida, D., et al. (2022). Training language models to follow instructions with human feedback. *Advances in Neural Information Processing Systems (NeurIPS)*, 35. [https://arxiv.org/abs/2203.02155](https://arxiv.org/abs/2203.02155)

[7] Hu, E. J., Shen, Y., Wallis, P., Allen-Zhu, Z., Li, Y., Wang, S., Wang, L., & Chen, W. (2022). LoRA: Low-Rank Adaptation of Large Language Models. *International Conference on Learning Representations (ICLR)*. [https://arxiv.org/abs/2106.09685](https://arxiv.org/abs/2106.09685)

[8] Dettmers, T., Pagnoni, A., Holtzman, A., & Zettlemoyer, L. (2023). QLoRA: Efficient Finetuning of Quantized LLMs. *Advances in Neural Information Processing Systems (NeurIPS)*, 36. [https://proceedings.neurips.cc/paper_files/paper/2023/hash/1feb87871436031bdc0f2beaa62a049b-Abstract.html](https://proceedings.neurips.cc/paper_files/paper/2023/hash/1feb87871436031bdc0f2beaa62a049b-Abstract.html)

[9] Dettmers, T. et al. *QLoRA* [Source code repository]. GitHub. [https://github.com/artidoro/qlora](https://github.com/artidoro/qlora)

[10] Singhal, K., Azizi, S., Tu, T., Mahdavi, S. S., et al. (2023). Large language models encode clinical knowledge. *Nature*, 620(7972), 172–180. [https://doi.org/10.1038/s41586-023-06291-2](https://doi.org/10.1038/s41586-023-06291-2)

[11] Colombo, P., Pires, T. P., Boudiaf, M., et al. (2024). SaulLM-7B: A pioneering Large Language Model for Law. *arXiv preprint* arXiv:2403.03883. [https://arxiv.org/abs/2403.03883](https://arxiv.org/abs/2403.03883)

[12] Taori, R., Gulrajani, I., Zhang, T., Dubois, Y., et al. (2023). Alpaca: A Strong, Replicable Instruction-Following Model. *Stanford CRFM*. [https://crfm.stanford.edu/2023/03/13/alpaca.html](https://crfm.stanford.edu/2023/03/13/alpaca.html)

[13] Zhou, C., Liu, P., Xu, P., Iyer, S., et al. (2023). LIMA: Less Is More for Alignment. *Advances in Neural Information Processing Systems (NeurIPS)*, 36. [https://arxiv.org/abs/2305.11206](https://arxiv.org/abs/2305.11206)

[14] Ovadia, O., Brief, M., Mishaeli, M., & Elisha, O. (2024). Fine-Tuning or Retrieval? Comparing Knowledge Injection in LLMs. *Proceedings of the 2024 Conference on Empirical Methods in Natural Language Processing (EMNLP)*. [https://aclanthology.org/2024.emnlp-main.15](https://aclanthology.org/2024.emnlp-main.15)

[15] Gekhman, Z., Yona, G., Aharoni, R., Eyal, M., Feder, A., Reichart, R., & Herzig, J. (2024). Does Fine-Tuning LLMs on New Knowledge Encourage Hallucinations? *Proceedings of the 2024 Conference on Empirical Methods in Natural Language Processing (EMNLP)*. [https://aclanthology.org/2024.emnlp-main.444](https://aclanthology.org/2024.emnlp-main.444)

[16] Luo, Y., Yang, Z., Meng, F., Li, Y., Zhou, J., & Zhang, Y. (2023). An Empirical Study of Catastrophic Forgetting in Large Language Models During Continual Fine-tuning. *arXiv preprint* arXiv:2308.08747. [https://arxiv.org/abs/2308.08747](https://arxiv.org/abs/2308.08747)

[17] Qi, X., Zeng, Y., Xie, T., Chen, P.-Y., Jia, R., Mittal, P., & Henderson, P. (2024). Fine-tuning Aligned Language Models Compromises Safety, Even When Users Do Not Intend To! *International Conference on Learning Representations (ICLR)*. [https://arxiv.org/abs/2310.03693](https://arxiv.org/abs/2310.03693)

[18] Carlini, N., Tramèr, F., Wallace, E., Jagielski, M., et al. (2021). Extracting Training Data from Large Language Models. *30th USENIX Security Symposium*. [https://www.usenix.org/conference/usenixsecurity21/presentation/carlini-extracting](https://www.usenix.org/conference/usenixsecurity21/presentation/carlini-extracting)

[19] 개인정보보호위원회. (2025). 생성형 인공지능(AI) 개발·활용을 위한 개인정보 처리 안내서 (2025.8.6. 공개). 보도 : [https://byline.network/2025/08/6-277/](https://byline.network/2025/08/6-277/)

[20] 문화체육관광부·한국저작권위원회. (2026). 생성형 인공지능(AI)의 저작물 학습에 대한 저작권법상 공정이용 안내서 (2026.2.26. 발간). 한국저작권위원회 누리집 [https://www.copyright.or.kr](https://www.copyright.or.kr), 보도 : [https://www.newsis.com/view/NISX20260226_0003527302](https://www.newsis.com/view/NISX20260226_0003527302)

[21] 「인공지능 발전과 신뢰 기반 조성 등에 관한 기본법」 (법률 제20676호, 2025.1.21. 공포, 2026.1.22. 시행). 국가법령정보센터 [https://www.law.go.kr](https://www.law.go.kr), 해설 : [https://shinkim.com/kor/media/newsletter/pdf/3114](https://shinkim.com/kor/media/newsletter/pdf/3114)

[22] 과학기술정보통신부. (2026). 인공지능 투명성 확보 안내 지침 (2026.1.21. 공개). 보도 : [https://kbmaeil.com/article/20260121500740](https://kbmaeil.com/article/20260121500740)