---

title: "Federated Learning"
subtitle: "개인정보를 지키며 협력하는 AI"
category: "TECH"
author: "Seoyeon Jang"
date: 2026-10-08
description: "연합 학습의 제안 배경, 개념, 실제 활용 사례를 살펴봅니다."
visual: "26_10_FL"
draft: false

------------

### 들어가며

안녕하세요. 이화여자대학교 데이터사이언스전공 제4대 학생회 피움입니다. 

어느새 짧은 가을이 지나가고 겨울이 고개를 내미는 10월 초입니다.

2주차 정기간행물의 주제는 **Federated Learning, 연합학습**입니다.

## 1. 연합 학습의 등장

인공지능의 성능은 일반적으로 학습 데이터의 양과 다양성에 크게 의존합니다. 하지만 의료 정보, 금융 거래, 개인의 스마트폰 사용 기록, 기업의 사용자 데이터처럼 가치가 높은 데이터일수록 개인정보 보호, 영업 비밀 등의 이유로 한 곳에 모으기 어려운 것이 현실입니다. 기존의 중앙 집중형 머신러닝은 여러 기관이나 개인의 데이터를 중앙 서버에 수집한 후에 모델을 학습시키기 때문에 이러한 문제들과 구조적으로 충돌합니다.

그렇다면 데이터를 한곳에 모으지 않고도 여러 데이터의 특징을 함께 학습할 방법은 없을까요? 

이 질문에서 출발한 것이 바로 연합학습입니다.

![그림 1. 기존의 centralized learning과 federated learning의 차이](public/images/federated-learning/image1-1.png)
![](public/images/federated-learning/image1-2.png)

*그림 1. 기존의 centralized learning과 federated learning의 차이 (출처 : Federated Learning, Dataflow, https://jaehong-data.tistory.com/79)*

연합학습에서는 데이터를 서버로 보내는 대신 **모델을 각 데이터가 있는 곳으로 보내 학습**합니다. 스마트폰이나 병원, 기업 내부의 서버가 자신의 데이터를 이용해 모델을 학습한 뒤, 학습 결과인 모델 업데이트만 중앙 서버로 전달합니다. 중앙 서버는 여러 참여자의 업데이트를 결합해 더 나은 글로벌 모델을 만들고, 다시 이를 참여자에게 전달합니다.

즉, 연합학습의 핵심은 한 문장으로 정리할 수 있습니다.

> **“데이터를 공유하지 않고도 지식을 공유하는 학습 방식”**

이 글에서는 연합학습이 왜 등장했는지부터 시작해, 어떤 방식으로 학습이 이루어지는지, 기존 머신러닝과 무엇이 다른지, 그리고 Google, NVIDIA, 글로벌 제약회사들은 이 기술을 실제로 어떻게 활용하고 있는지를 차례대로 살펴보겠습니다.

## 2. 연합학습은 어떻게 작동할까?

### 2.1 연합학습의 정의

'**연합학습**'이라는 이름은 Google 연구진이 2016년 발표하고 2017년 AISTATS 학회에 게재한 논문에서 처음 제안되었습니다. Google은 같은 해 공식 블로그를 통해 이 기술을 대중에게 소개하며, 스마트폰이 데이터를 기기 안에 그대로 둔 채 공유 모델을 함께 학습하는 방식이라고 설명했습니다.

이후 연합학습 분야의 연구를 폭넓게 정리한 Kairouz 등의 논문은 연합학습을 다음과 같이 정의합니다. 여러 참여자(클라이언트)가 중앙 서버의 조정 아래 하나의 모델을 함께 학습하되, **학습 데이터는 각 참여자에게 분산된 상태로 유지되는** 기계학습 방식이라는 것입니다.

이 정의에서 핵심적인 정의는 2가지입니다. 

1. **원본 데이터는 클라이언트 외부로 벗어나지 않습니다.** 
서버는 민감한 개인정보가 포함된 데이터에 접근할 수 없습니다.
- **서버로 가는 것은 집계에 필요한 최소한의 정보뿐입니다.** 
대표적으로 모델 가중치가 학습 후 얼마나 바뀌었는지를 나타내는 업데이트가 여기에 해당합니다.

비유하자면, 여러 식당의 셰프들이 각자의 주방에서 자기 손님들의 반응을 보며 레시피를 개선하고, 손님 명단이 아니라 "소금을 조금 줄이니 좋더라"는 개선 방향만 본사에 알려주는 것과 비슷합니다. 본사는 이 조언들을 종합해 더 나은 표준 레시피를 만들어 다시 모든 식당에 배포합니다.

### 2.2 한 번의 학습 라운드 들여다보기

연합학습의 가장 기본이 되는 알고리즘은 **연합 평균(Federated Averaging, FedAvg)** 입니다. FedAvg는 '라운드'라는 단위를 반복하며 학습을 진행하는데, 한 라운드는 다음의 다섯 단계로 이루어집니다.

![그림2](public/images/fl_2.png)
*그림2. 알고리즘의 슈도 코드. ( 출처 : Communication-Efficient Learning of Deep Networks
from Decentralized Data, McMahan et al.,2017 )*

1. **클라이언트 k 선택**: 서버는 참여 가능한 기기나 기관 중 일부를 무작위로 고릅니다. 전체 중 몇 퍼센트를 고를지는 하이퍼파라미터 *C*로 정합니다.
2. **모델 배포**: 서버는 현재의 글로벌 모델을 선택된 클라이언트에게 보냅니다.
3. **로컬 학습**: 각 클라이언트는 자신이 가진 데이터로 모델을 학습합니다. 이때 미니배치 크기 *B*로 *E* 에폭만큼 확률적 경사하강법(SGD)을 수행합니다.
4. **업데이트 업로드**: 클라이언트는 원본 데이터가 아니라 학습으로 갱신된 모델 가중치만 서버로 보냅니다.
5. **가중 평균 집계**: 서버는 받은 모델들을 각 클라이언트의 데이터 수에 비례한 가중치로 평균해 새로운 글로벌 모델을 만듭니다. 가중치에 의해, 데이터를 많이 가진 클라이언트의 모델이 좀 더 큰 목소리를 내게 됩니다. 

FedAvg의 핵심 아이디어는 **통신은 적게, 계산은 로컬에서 많이** 하는 것입니다. 기존의 분산 학습처럼 경사를 한 번 계산할 때마다 서버와 통신하는 대신, 각 기기가 여러 번 학습을 진행한 뒤 결과만 보냅니다. 원 논문은 이 방식으로 동기식 SGD에 비해 필요한 통신 라운드 수를 10배에서 100배까지 줄일 수 있음을 실험으로 보였습니다.

## 3. 연합학습의 한계

여기까지 보면 연합학습은 참신하고 보안적으로도 완벽해 보입니다. 하지만 데이터를 한곳에 모으지 않는다는 선택은 새로운 어려움을 함께 가져옵니다.

### 3.1 제각각인 데이터: Non-IID 문제

중앙집중식 학습에서는 데이터를 골고루 섞을 수 있어서, 무작위로 뽑은 일부 데이터도 전체의 특징을 잘 대표합니다. 연합학습에서는 이 전제가 깨집니다. 한 사람의 키보드 입력에는 그 사람만의 말투가 담기고, 한 병원의 환자 구성은 지역이나 전문 진료과에 따라 치우칩니다. 이렇게 참여자마다 데이터 분포가 서로 다른 상황을 **Non-IID**(독립적이고 동일한 분포를 따르지 않음)라고 부르며, 연합학습의 가장 근본적인 난제로 꼽힙니다.


![그림3](public/images/federated-learning/image3.png)
*그림3. Non-IID 데이터 분포와 클라이언트 드리프트 개념도, 출처 : Anthropic*

로컬 학습을 여러 번 반복할수록 각 클라이언트의 모델은 자기 데이터에 맞는 방향으로 끌려가고, 이를 평균한 업데이트는 모두에게 좋은 방향(점선)에서 벗어나게 됩니다.

(다)처럼 각 클라이언트의 모델이 자기 데이터 쪽으로 끌려가는 현상을 **클라이언트 드리프트(client drift)** 라고 합니다. 이를 해결하기 위한 대표적인 방법론을 다룬 기법으로는 FedProx, SCAFFOLD가 있습니다.

### 3.2 느리고 불안정한 통신

크로스 디바이스 환경에서는 기기마다 성능, 배터리, 네트워크 품질이 모두 다르고, 학습 도중에 사용자가 휴대폰을 집어 들면 참여가 중단됩니다. Google이 공개한 대규모 연합학습 시스템 설계 논문은 이런 이탈을 당연한 전제로 받아들입니다. 예를 들어 라운드마다 필요한 수보다 많은 기기를 선택해 두고, 정해진 수의 결과가 모이면 집계를 진행하는 방식으로 설계했습니다. 또한 업데이트를 주고받는 비용을 줄이기 위해 모델 업데이트를 압축하는 기법들도 함께 연구되고 있습니다.

### 3.3 "데이터를 안 보냈으니 안전하다"는 착각

연합학습에 대한 가장 흔한 오해는 원본 데이터를 보내지 않으니 개인정보가 자동으로 보호된다는 생각입니다. 하지만 모델 업데이트에도 학습 데이터에 대한 정보가 녹아 있습니다. Zhu 등은 **공유된 경사(gradient) 정보만으로 원본 이미지를 픽셀 단위로, 텍스트를 토큰 단위로 복원할 수 있음**을 보여 큰 주목을 받았고, Geiping 등은 보다 현실적인 조건에서도 이러한 복원 공격이 가능함을 확인했습니다.

![그림4](public/images/federated-learning/image4.png)
*그림 4. 연합학습에 보안 집계와 차등 프라이버시를 결합한 다층 보호 구조, 출처 : Anthropic*

그래서 실제 서비스에서는 연합학습에 보안 집계, 차등 프라이버시 등 여러 겹의 **보호 장치**를 더합니다. 그러나 노이즈를 많이 넣을수록 개인정보 보호는 강해지지만 모델의 정확도는 떨어집니다. 또 악의적인 참여자가 조작된 업데이트를 보내 모델을 오염시키는 **중독(poisoning) 공격**도 있는데, 보안 집계로 개별 업데이트를 볼 수 없게 되면 이런 공격을 찾아내기가 오히려 어려워집니다.

 결국 연합학습 시스템을 설계한다는 것은 프라이버시, 정확도, 비용, 안전성 사이의 trade-off 관계에서 적당한 균형점을 찾는 일입니다.

 # 4. 연합 학습의 실제 기업 사례

### 4.1 Google: 스마트폰 키보드 Gboard

연합학습이 가장 먼저 대규모로 적용된 제품은 Google의 모바일 키보드 앱 **Gboard**입니다. Google은 2017년 블로그를 통해 Gboard에서 연합학습을 시험하고 있다고 발표했습니다.

**키보드의 다음 단어 추천 기능**을 개선하려면 사람들이 실제로 어떤 문장을 입력하는지 알아야 합니다. 하지만 사용자가 입력한 메시지를 서버로 수집하는 것은 프라이버시 측면에서 받아들이기 어렵습니다. Hard 등은 2018년 논문에서 **다음 단어 예측용 신경망 언어 모델을 사용자 기기에서 연합학습으로 훈련**했고, 이 모델이 서버에서 학습한 모델보다 예측 재현율(recall)이 더 높았다고 보고했습니다. 실제 사용자의 입력이라는, 서버로는 모으기 곤란한 양질의 데이터를 활용할 수 있었기 때문입니다.

Gboard의 연합학습은 이후 **개인정보 보호를 한층 강화**하는 방향으로 발전했습니다. 2023년 ACL 학회에 발표된 Xu 등의 논문에 따르면, Google은 공개 데이터로 먼저 사전학습한 뒤 **DP-FTRL**이라는 차등 프라이버시 알고리즘을 적용해 20개가 넘는 Gboard 언어 모델을 연합학습으로 훈련하고 배포했으며, 일부 모델에는 보안 집계도 함께 적용했습니다. 같은 논문은 Gboard의 모든 다음 단어 예측 신경망 모델이 차등 프라이버시 보장을 갖추게 되었고, 앞으로 출시될 신경망 언어 모델에도 이를 필수 요건으로 삼겠다고 밝혔습니다.

> Gboard 사례는 연합학습이 단독으로 쓰이는 기술이 아니라, **차등 프라이버시와 보안 집계를 함께 묶은 표준 파이프라인**으로 자리 잡았다는 것을 보여줍니다.

### 4.2 NVIDIA: 20개 의료기관이 함께 만든 코로나19 예측 모델 EXAM

의료는 연합학습의 가치가 가장 분명하게 드러나는 분야입니다. 

환자 데이터는 병원 밖으로 내보내기 어렵지만, 한 병원의 데이터만으로 만든 AI 모델은 다른 병원 환자들에게 잘 맞지 않는 경우가 많습니다.

코로나19 대유행이 한창이던 2020년, **NVIDIA와 미국 Mass General Brigham을 비롯한 전 세계 20개 의료기관**은 연합학습으로 **EXAM**이라는 모델을 개발했습니다. EXAM은 응급실에 온 코로나19 환자의 활력징후, 혈액 검사 수치, 흉부 X선 영상을 입력받아 앞으로 산소 치료가 얼마나 필요할지를 예측합니다. 연구진은 2020년 3월에서 5월 사이에 참여 기관을 모집했고, 8월부터 10월까지 140회의 독립적인 연합학습 실행을 거쳐 모델을 완성했습니다. 기관 간 데이터 이전 없이 불과 몇 달 만에 국제 공동 모델을 만들어낸 것입니다.

2021년 국제 학술지 Nature Medicine에 실린 결과에 따르면, EXAM은 응급실 도착 후 24시간과 72시간 시점의 예후 예측에서 평균 AUC 0.92 이상을 기록했습니다. 각 기관이 자기 데이터만으로 학습한 모델과 비교하면 **평균 AUC는 16%, 일반화 성능은 평균 38% 향상**되었습니다

한 병원의 데이터로만 학습한 모델은 그 병원의 환자 구성과 장비에 과도하게 맞춰지기 쉽습니다. 일반화 성능에서 알 수 있듯, 연합학습은 **여러 대륙의 다양한 환자 데이터를 반영함으로써, 처음 보는 병원에서도 잘 작동하는 모델**을 만들 수 있게 해주었습니다.

### 4.3 글로벌 제약회사들: 경쟁사끼리 손잡은 MELLODDY

**MELLODDY** 프로젝트는 연합학습이 **경쟁 기업 사이의 협력**까지 가능하게 한다는 것을 보여준 상징적인 사례입니다. 유럽 혁신의약품이니셔티브(IMI)의 지원을 받은 이 프로젝트에는 **10개의 글로벌 제약회사**와 기술 기업, 대학이 참여했습니다.

신약 개발에서는 어떤 화합물이 특정 단백질에 얼마나 잘 작용하는지를 예측하는 AI 모델(QSAR 모델)이 중요합니다. 데이터가 많을수록 예측이 정확해지지만, 제약회사에게 실험 데이터는 경쟁사에게 절대 공유할 수 없는 **영업 비밀**입니다. 

MELLODDY는 이 문제를 **다중 작업 학습(multi-task learning)을 참여사 간으로 확장**하는 방식으로 풀었습니다. 모델을 두 부분으로 나누어, 화합물 구조를 이해하는 공통 부분은 10개 회사가 함께 학습하고, 각 회사의 실험 과제를 예측하는 출력 부분은 해당 회사만 보유하는 구조입니다.

학습은 프라이버시와 보안 측면의 감사를 거친 플랫폼 위에서 진행되었고, **10개 제약회사 모두 자사의 예측 모델에서 향상된 성능을 얻었습니다**. 모든 회사가 자신의 데이터나 어떤 화합물을 연구하는지를 드러내지 않으면서도 업계 전체 규모의 데이터 학습 메리트를 얻은 것입니다. 

이 외에도 Apple의 온디바이스 개인화, Intel, Penn Medicine의 뇌종양 수술 대상 경계 검출 모델 개발 등 연합 학습은 다양한 분야로 확산되고 있습니다.

## 5. 마치며

연합학습은 "좋은 AI를 만들려면 데이터를 한곳에 모아야 한다"는 오랜 전제를 뒤집었습니다. 

또한 단순히 개인정보 보호가 아니라, **데이터를 공유할 수 없는 개인과 조직 사이에서도 AI의 지식을 공유할 수 있게 만드는 협력 구조**를 제공한다는 데 그 가치가 있습니다. 

모델을 데이터에게 보내고 학습 결과만 모은다는 단순한 아이디어에서 출발해, 제각각인 데이터를 다루는 최적화 기법과 보안 집계, 차등 프라이버시 같은 보호 기술이 더해지며 실제 서비스에 쓰일 수 있는 수준까지 발전했습니다. 

> 결국 연합학습의 미래 경쟁력은 모델 정확도뿐 아니라 **성능·프라이버시·보안·통신비용·데이터 주권 사이의 균형을 얼마나 효과적으로 설계하는가**에 달려 있다고 평가할 수 있습니다.

## References
[1] McMahan, H. B., Moore, E., Ramage, D., Hampson, S., & Agüera y Arcas, B. (2017). Communication-Efficient Learning of Deep Networks from Decentralized Data. *Proceedings of the 20th International Conference on Artificial Intelligence and Statistics (AISTATS)*, PMLR 54, 1273–1282. https://proceedings.mlr.press/v54/mcmahan17a.html (arXiv:1602.05629)

[2] McMahan, B., & Ramage, D. (2017, April 6). Federated Learning: Collaborative Machine Learning without Centralized Training Data. *Google Research Blog*. https://research.google/blog/federated-learning-collaborative-machine-learning-without-centralized-training-data/

[3] Kairouz, P., McMahan, H. B., Avent, B., Bellet, A., Bennis, M., Bhagoji, A. N., et al. (2021). Advances and Open Problems in Federated Learning. *Foundations and Trends in Machine Learning*, 14(1–2), 1–210. https://doi.org/10.1561/2200000083 (arXiv:1912.04977)

[4] Bonawitz, K., Eichner, H., Grieskamp, W., Huba, D., Ingerman, A., Ivanov, V., et al. (2019). Towards Federated Learning at Scale: System Design. *Proceedings of Machine Learning and Systems (MLSys)*, 1, 374–388. https://arxiv.org/abs/1902.01046

[5] Yang, Q., Liu, Y., Chen, T., & Tong, Y. (2019). Federated Machine Learning: Concept and Applications. *ACM Transactions on Intelligent Systems and Technology*, 10(2), Article 12. https://doi.org/10.1145/3298981

[6] Li, T., Sahu, A. K., Zaheer, M., Sanjabi, M., Talwalkar, A., & Smith, V. (2020). Federated Optimization in Heterogeneous Networks. *Proceedings of Machine Learning and Systems (MLSys)*, 2, 429–450. https://arxiv.org/abs/1812.06127

[7] Karimireddy, S. P., Kale, S., Mohri, M., Reddi, S., Stich, S., & Suresh, A. T. (2020). SCAFFOLD: Stochastic Controlled Averaging for Federated Learning. *Proceedings of the 37th International Conference on Machine Learning (ICML)*, PMLR 119, 5132–5143. https://arxiv.org/abs/1910.06378

[8] Zhu, L., Liu, Z., & Han, S. (2019). Deep Leakage from Gradients. *Advances in Neural Information Processing Systems (NeurIPS)*, 32. https://arxiv.org/abs/1906.08935

[9] Geiping, J., Bauermeister, H., Dröge, H., & Moeller, M. (2020). Inverting Gradients: How Easy Is It to Break Privacy in Federated Learning? *Advances in Neural Information Processing Systems (NeurIPS)*, 33. https://arxiv.org/abs/2003.14053

[10] Bonawitz, K., Ivanov, V., Kreuter, B., Marcedone, A., McMahan, H. B., Patel, S., Ramage, D., Segal, A., & Seth, K. (2017). Practical Secure Aggregation for Privacy-Preserving Machine Learning. *Proceedings of the 2017 ACM SIGSAC Conference on Computer and Communications Security (CCS)*, 1175–1191. https://doi.org/10.1145/3133956.3133982

[11] Dwork, C., & Roth, A. (2014). The Algorithmic Foundations of Differential Privacy. *Foundations and Trends in Theoretical Computer Science*, 9(3–4), 211–407. https://doi.org/10.1561/0400000042

[12] McMahan, H. B., Ramage, D., Talwar, K., & Zhang, L. (2018). Learning Differentially Private Recurrent Language Models. *International Conference on Learning Representations (ICLR)*. https://arxiv.org/abs/1710.06963

[13] Hard, A., Rao, K., Mathews, R., Ramaswamy, S., Beaufays, F., Augenstein, S., Eichner, H., Kiddon, C., & Ramage, D. (2018). Federated Learning for Mobile Keyboard Prediction. *arXiv preprint* arXiv:1811.03604. https://arxiv.org/abs/1811.03604

[14] Xu, Z., Zhang, Y., Andrew, G., Choquette-Choo, C. A., Kairouz, P., McMahan, H. B., Rosenstock, J., & Zhang, Y. (2023). Federated Learning of Gboard Language Models with Differential Privacy. *Proceedings of the 61st Annual Meeting of the Association for Computational Linguistics (Volume 5: Industry Track)*, 629–639. https://doi.org/10.18653/v1/2023.acl-industry.60 (arXiv:2305.18465)

[15] Dayan, I., Roth, H. R., Zhong, A., Harouni, A., Gentili, A., Abidin, A. Z., et al. (2021). Federated learning for predicting clinical outcomes in patients with COVID-19. *Nature Medicine*, 27(10), 1735–1743. https://doi.org/10.1038/s41591-021-01506-3

[16] Heyndrickx, W., Mervin, L., Morawietz, T., Sturm, N., Friedrich, L., Zalewski, A., et al. (2024). MELLODDY: Cross-pharma Federated Learning at Unprecedented Scale Unlocks Benefits in QSAR without Compromising Proprietary Information. *Journal of Chemical Information and Modeling*, 64(7), 2331–2344. https://doi.org/10.1021/acs.jcim.3c00799

[17] Paulik, M., Seigel, M., Mason, H., Telaar, D., Kluivers, J., van Dalen, R., et al. (2021). Federated Evaluation and Tuning for On-Device Personalization: System Design & Applications. *arXiv preprint* arXiv:2102.08503. https://machinelearning.apple.com/research/federated-personalization

[18] Pati, S., Baid, U., Edwards, B., Sheller, M., Wang, S.-H., Reina, G. A., et al. (2022). Federated learning enables big data for rare cancer boundary detection. *Nature Communications*, 13, 7346. https://doi.org/10.1038/s41467-022-33407-5

[19] Reina, G. A., Gruzdev, A., Foley, P., Perepelkina, O., Sharma, M., Davidyuk, I., et al. (2021). OpenFL: An open-source framework for Federated Learning. *arXiv preprint* arXiv:2105.06413. https://arxiv.org/abs/2105.06413

[20] The Linux Foundation. (2019, June 25). The Linux Foundation Will Host the Federated AI Enabler to Responsibly Advance Data Modeling [Press release]. https://www.linuxfoundation.org/press/press-release/the-linux-foundation-will-host-the-federated-ai-enabler-to-responsibly-advance-data-modeling

[21] FederatedAI. *FATE: An Industrial Grade Federated Learning Framework* [Source code repository]. GitHub. https://github.com/FederatedAI/FATE

[22] Rieke, N., Hancox, J., Li, W., Milletarì, F., Roth, H. R., Albarqouni, S., et al. (2020). The future of digital health with federated learning. *npj Digital Medicine*, 3, 119. https://doi.org/10.1038/s41746-020-00323-1

[23] Beutel, D. J., Topal, T., Mathur, A., Qiu, X., Fernandez-Marques, J., Gao, Y., et al. (2020). Flower: A Friendly Federated Learning Research Framework. *arXiv preprint* arXiv:2007.14390. https://arxiv.org/abs/2007.14390

[24] Granqvist, F., Song, C., Cahill, Á., van Dalen, R., et al. (2024). pfl-research: Simulation Framework for Accelerating Research in Private Federated Learning. *arXiv preprint* arXiv:2404.06430. https://arxiv.org/abs/2404.06430
