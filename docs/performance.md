# Summary
Next.js 공식 문서의 권장사항을 준수하여 렌더링 성능을 최적화했습니다.

---

# Key Changes

## 1. Server Component
[feat(data): API 클라이언트를 연동하여 데이터 페칭 로직 구현 > layout.tsx](https://github.com/developer-choi/best-practice/pull/2/commits/e97816bd45916606d1afb038d9b6d2c02d23ca30#diff-861b27daa40abcafed7ed1b02b7643975294cda520e16456599b0ffd9dac1b18)

### Background
> [To reduce the size of your client JavaScript bundles, add 'use client' to specific interactive components (Nextjs docs)](https://nextjs.org/docs/app/getting-started/server-and-client-components#reducing-js-bundle-size)

### Principle
* 이번 구현 범위에는 인터랙션이 불필요했기에, `use client` 대신 Server Component로 구현했습니다.
* 반대로 `use client`를 사용해야 한다면, 번들 사이즈 증가라는 비용을 상회할 만큼의 명확한 근거가 있어야 한다고 생각합니다.
* 그래서, 실무에서는 무한스크롤을 제외하면, Client Component를 사용 할 일이 거의 없었습니다.
* 같은 근거로, Tanstack Query도 예전에는 많이 사용했지만, 이제는 사용 할 일이 많이 줄어들었습니다.


## 2. Streaming 도입
[feat(loading): 비디오 목록 페이지 로딩 스켈레톤 UI 추가 > loading.tsx](https://github.com/developer-choi/best-practice/pull/2/commits/3b0a147f25c08beaea6698fbadb19239db659d36)

### Background
> [To improve the initial load time and user experience, you can use streaming (Nextjs Docs)](https://nextjs.org/docs/app/getting-started/fetching-data#streaming)

### Problem
* 과거 Pages Router 시절에는 `getServerSideProps()`로 SSR을 하는 경우 API 응답이 하나라도 지연되면 페이지 응답이 늦어지는 (Blocking) 치명적인 문제가 있었습니다.
* 이 문제를 개선하기 위해, CSR으로 전환하여 로딩을 먼저 노출하는 차선책을 사용해왔습니다.

### Solution
Streaming은 위 두 가지 방식의 장점만을 결합하여 근본적인 문제를 해결합니다.

* **vs `getServerSideProps()`:**
    * 백엔드 API 응답 지연과 무관하게, **즉시** 사용자에게 로딩 화면을 먼저 보여줍니다. (Blocking 해결)
* **vs CSR:**
    * **CSR:** `JS 번들 다운로드` → `React 코드 실행` → `그제서야 API 호출` 되는 과정이 필요없습니다.
    * **Streaming:** 요청이 Nextjs 서버에 도달한 **즉시** 백엔드 API가 호출될 수 있습니다.

### UX Impact
* 다른 페이지로 가는 링크를 클릭 했을 때 화면 전환이 빨리 일어날 수 있게됩니다.


## 3. Caching Strategy: Channel Info
[perf(cache): 채널 정보 API에 5분 단위 Time-based Revalidation 적용](https://github.com/developer-choi/best-practice/pull/2/commits/e9728dbfeb40a8b4240cd67e3b353d3eeebe17d8)

### Background
> [Next.js has a built-in Data Cache that persists the result of data fetches across incoming server requests and deployments. (Nextjs docs)](https://nextjs.org/docs/14/app/building-your-application/caching#data-cache)

> [In Next.js, you can have dynamically rendered routes that have both cached and uncached data. (Nextjs docs)](https://nextjs.org/docs/14/app/building-your-application/rendering/server-components#dynamic-rendering)

### Analysis
* 유튜브 채널 정보는 모든 사용자에게 동일하게 보이는 정적 데이터입니다.
* 이 정보가 최신화되야하는 시점은 '관리자가 채널정보를 수정할 때'와 '구독자 수가 늘어날 때'입니다.

### Proposal
* 구독자 수의 실시간 갱신 대신, n분의 지연이 발생해도 괜찮은지 기획팀과 논의하겠습니다.
* 대신, 관리자의 정보 수정만큼은 즉시 반영하는 조건으로 타협안을 제시하겠습니다.

### Implementation
* 구독자 수는 실시간으로 최신화 될 필요성이 적다고 판단되어, **n분 주기의 [Time-based Revalidation](https://nextjs.org/docs/14/app/building-your-application/caching#revalidating-1)**을 적용하겠습니다.
* 반면, 관리자 수정 시점에는 **[On-demand Revalidation](https://nextjs.org/docs/14/app/building-your-application/caching#revalidating-1)**을 통해 즉시 갱신하겠습니다.

### Impact
* 이 전략을 통해, **유저 10억 명이 동시에 접속하더라도 백엔드 API는 주기당(5분) 최대 1번만 호출됨을 보장**할 수 있습니다.


## 4. Caching Strategy: Video List
[perf(cache): 비디오 목록 API에 캐싱 비활성화 적용](https://github.com/developer-choi/best-practice/pull/2/commits/ffe73cf43c4baf2a3cb3f4436304488b6034dfed)

### Analysis
비디오 목록에는 **실시간으로 변하는 조회수**가 포함되어 있습니다.

여기서 두 가지 관점이 충돌합니다:
1.  **Efficiency:** 물론 1의 자리까지 정확할 필요는 없으니, 캐싱을 해서 서버 부하를 줄이는 게 기술적으로는 더 효율적일 수 있습니다.
2.  **User Expectation:** 하지만 사용자들은 보통 이런 숫자가 바로바로 바뀌는 것을 더 자연스럽게 느낍니다.

### Decision
하지만 사용자가 영상을 시청했는데 조회수가 그대로라면 오히려 어색할 것 같았습니다.

### Implementation
* 따라서 비디오 목록 API에는 `cache: 'no-store'` 옵션을 적용하여, 매 요청마다 최신 데이터를 가져오도록 구현했습니다.


## 5. Future Plan: Partial Prerendering (PPR)

현재 방식에도 아직 아쉬움이 남아있습니다.

### Limitation
> [During rendering, if a dynamic function or uncached data request is discovered, Next.js will switch to dynamically rendering the whole route. (Nextjs docs)](https://nextjs.org/docs/14/app/building-your-application/rendering/server-components#switching-to-dynamic-rendering)

> [In most websites, routes are not fully static or fully dynamic (Nextjs docs)](https://nextjs.org/docs/14/app/building-your-application/rendering/server-components#dynamic-rendering)

공식 문서의 설명처럼 대부분의 웹사이트는 정적/동적 요소가 혼재되어 있습니다. 하지만 현재는 `cookies()`와 같은 동적 함수를 하나만 사용해도 **페이지 전체가 Full Route Cache(Static Build) 대상에서 제외되는 한계**가 있습니다.

### Expectation
향후 [Partial Prerendering](https://nextjs.org/docs/15/app/getting-started/partial-prerendering) 기능이 Stable 단계로 도입되기를 기대하고 있습니다.

> [to combine static and dynamic content in the same route. This improves the initial page (Nextjs docs)](https://nextjs.org/docs/15/app/getting-started/partial-prerendering)

---

# Rethinking Tanstack Query

### Context
저는 이번 프로젝트에 Tanstack Query를 도입하지 않았습니다.

하지만, Tanstack Query를 사용하여 개발하시는 분들을 많이 봤습니다.

주로 클라이언트에서 데이터를 페칭했고, 페이지를 이동했다가 다시 돌아왔을 때 캐시된 데이터를 보여주기 위함이었습니다.

그래서, 이 방식이 현재의 Next.js 환경에서도 여전히 최선인지 다시 한번 고민해 보았습니다.

### Analysis
리서치 과정에서 TkDodo 또한 이와 같은 견해를 가지고 있음을 확인했습니다.

> To understand if your application can benefit from React Query when also using Server Components, see the article [You Might Not Need React Query.](https://tkdodo.eu/blog/you-might-not-need-react-query)

### Decision
저자의 견해에 깊이 공감하여, 저자가 제시한 기준을 거의 그대로 따르기로 했습니다.

1. 기본적으로 Tanstack Query는 사용하지 않습니다.
2. 단, 아래 2가지 경우처럼 특별히 필요한 상황에만 사용합니다.

* **Infinite Scroll:** 스크롤 이벤트는 서버에서 발생하는게 아니기 때문에, 사용자의 브라우저에 데이터를 캐시로 저장해야합니다.
* **Background Refetching:** `Window Focus` 시 최신 데이터 갱신 등 정교한 동기화가 필요한 경우에도 Tanstack Query는 유효합니다.

### Collaboration
* 다만, 위 기준은 개인적인 기술적 지향점입니다.
* 실무 환경에서는 합리적인 도입 근거가 있거나, 팀원들의 선호도에 따라 달라질 수 있습니다.