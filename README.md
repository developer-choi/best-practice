# Project Overview

> [유튜브 채널 페이지](https://www.youtube.com/@VercelHQ)를 예제로 구현하며, 저의 개발 가치관을 담은 프로젝트입니다.

---

# 1. Project Concept

구현 과정을 PR 단위로 기록했습니다. 각 링크를 클릭하시면 상세 내용을 확인하실 수 있습니다.

### 🚀 PR 1. [성능 개선](https://github.com/developer-choi/best-practice/pull/2)
* **Server Components:** 번들 사이즈 감소
* **Streaming:** SSR의 Blocking 문제 해결 및 TTFB 단축
* **Caching Strategy:** 데이터 성격에 따른 Time-based, On-demand Revalidation 설계

### 🛡️ PR 2. [Sentry 도입](https://github.com/developer-choi/best-practice/pull/3)
* **Class-based:** Sentry 로직을 추상화하여, 팀원들이 별도 학습 없이 사용 가능
* **Triage Process:** `발견 → 분류 → 해결`로 이어지는 에러 대응 워크플로우

### 🧪 PR 3. [테스트 적용](https://github.com/developer-choi/best-practice/pull/4)
Testing Library의 공식 원칙(Guiding Principles)을 준수하여, 사용자 관점의 테스트를 작성했습니다.

---

# 2. Getting Started

아래 링크를 통해 배포된 결과물을 바로 확인하시거나, 로컬 환경에서 실행해보실 수 있습니다.

**👉 [Deployment Link (Vercel)](https://best-practice-alpha.vercel.app/channel/1/videos)**

```bash
# 1. Install dependencies
yarn install

# 2. Run development server
yarn dev