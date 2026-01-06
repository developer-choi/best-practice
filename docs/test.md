# 테스트 작성

Testing Library 공식 문서의 권장 사항을 기준으로, 채널 레이아웃과 비디오 목록에 대해 테스트를 작성했습니다.

---

# 테스트 기준

테스트 코드는 다음 3가지 기준을 참고하여 작성했습니다.

### 1. 사용자 중심 테스트
> [The more your tests resemble the way your software is used, the more confidence they can give you. (Testing Library)](https://testing-library.com/docs/guiding-principles)

테스트가 실제 사용자의 사용 방식과 유사할수록 더 높은 신뢰도를 제공합니다.

따라서 구현 세부사항(내부 state, props)보다는 사용자가 보고 상호작용하는 방식으로 테스트를 작성했습니다.

### 2. 쿼리 우선순위
> [Your test should resemble how users interact with your code (component, page, etc.) as much as possible. (Testing Library)](https://testing-library.com/docs/queries/about#priority)

테스트는 사용자가 코드와 상호작용하는 방식과 최대한 유사해야 합니다.

따라서 `getById`처럼 구현에 의존하는 방식보다, `getByRole`, `getByAltText` 같은 접근성 기반 쿼리를 우선 사용했습니다.

이는 스크린리더 사용자를 포함한 모든 사용자가 실제로 인식하는 방식과 동일하게 테스트하는 것입니다.

### 3. 케이스 분류
테스트 케이스 누락을 방지하기 위해, 다음 3가지 분류 기준을 적용했습니다.

* **General Case:** 정상 동작 검증
* **Edge Case:** 예외 상황 검증 (404, 500 에러 등)
* **Boundary Case:** 데이터가 없거나(0개), 리스트가 넘치는 등 입력값의 경계 조건 검증

---

# 테스트 범위 및 케이스

### 1. 채널 레이아웃 ([커밋](https://github.com/developer-choi/best-practice/commit/e6300352))

* **General Case**
    * 채널의 배너, 아바타, 이름, 구독자 수가 API 응답 데이터와 일치하게 렌더링되는지 검증했습니다.
* **Edge Case**
    * **404:** 존재하지 않는 채널 ID로 접근 시, 404 UI가 노출되는지 확인했습니다.
    * **Others:** 그 외 에러(500 등) 발생 시, 에러 페이지가 노출되는지 확인했습니다.

### 2. 비디오 목록 페이지 ([커밋](https://github.com/developer-choi/best-practice/commit/191046be))

* **General Case**
    * 비디오 목록 데이터가 썸네일, 링크와 함께 정상적으로 노출되는지 확인했습니다.
* **Boundary Case**
    * 비디오가 0개일 때, 안내 문구가 뜨는지 확인했습니다.
* **Edge Case**
    * 채널 레이아웃과 동일하게 적용했습니다. (404 및 에러 페이지 검증)
