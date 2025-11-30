# 개요
실무에서 겪은 문제의 해결과정을 **예제 기준**으로 소개드립니다.

---

# 1. 성능 개선

### 1-1. 잘못된 SSR 방식 vs Streaming 방식 TTFB 비교  
<img width="896" height="403" src="/docs/ttfb.png" />

### 1-2. CSR vs Server Component 대비 번들 사이즈 감소량
<img width="621" height="255" src="/docs/bundle.png" />

### [개선방법 링크](https://github.com/developer-choi/best-practice/pull/2)

---

# 2. Sentry 로깅 표준화

### 2-1. Sentry 이슈 갯수가 86종에서 1종으로 줄어든 방법
<img width="528" height="262" src="/docs/error.png" />

1,500건의 오류이벤트, 86종의 Sentry 이슈가 각각 **250건**, **1종**으로 줄었습니다.

### 2-2. 기존 단서데이터, 최신 단서데이터 비교하는 캡처
<img width="923" height="580" src="/docs/extra.png" />

### [개선방법 링크](https://github.com/developer-choi/best-practice/pull/3)

---

# Getting Started

아래 링크를 통해 배포된 결과물을 바로 확인하시거나, 로컬 환경에서 실행해보실 수 있습니다.

**👉 [Deployment Link (Vercel)](https://best-practice-alpha.vercel.app/channel/1/videos)**

```bash
# 1. Install dependencies
yarn install

# 2. Run development server
yarn dev
