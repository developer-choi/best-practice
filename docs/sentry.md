# 장애 대응 프로세스 구축 및 Sentry 이슈 98% 해결

## 1. 문제 정의: 방치된 86개의 Sentry 이슈와 2,000만 원의 손실
고객이 오류를 제보해도 개발 환경에서 재현되지 않아, 고객에게 캡처를 요청해야 하는 등 **비효율적인 커뮤니케이션**이 반복되었습니다.

그리고 구매 페이지 로딩 오류로 인해 **약 2,000만 원 상당의 피해**가 발생했습니다. 개발팀이 오류를 뒤늦게 인지하여 대응이 지연된 것이 원인이었습니다.

분석 결과, Sentry 대시보드는 관리가 안 되는 상태였습니다.
* **방치된 이슈:** 86종의 이슈가 뒤섞인 채 방치되어 있어 중요도를 파악할 수 없음
* **단서 부족:** 오류 해결에 필요한 정보 없이 에러 메시지만 존재
* **우선순위 부재:** 모든 에러 등급이 동일하여 긴급한 이슈 식별 불가

## 2. 해결 전략 및 구현 로드맵
문제를 해결하기 위해 다음과 같이 단계별 로드맵을 수립했습니다.

1.  **Grouping:** 이슈를 원인 기반으로 통합하여, 관리해야 할 이슈의 개수를 줄이자.
2.  **Priority:** 이슈의 중요도를 식별하여 긴급한 오류부터 우선 대응하자.
3.  **Context:** 해결할 수 있는 충분한 단서를 자동으로 첨부하자.
4.  **Developer Experience:** Sentry를 모르는 동료도 유지보수할 수 있게 추상화하자.

## 3. 구현 방법

### 3-1. 공식 문서 방식의 단점
에러를 던질 때마다 Sentry 전용 함수(`withScope`, `setTag`)를 작성해야 했습니다.

```typescript
// Sentry 공식 문서 방식: 비즈니스 로직에 Sentry 문법이 섞임
Sentry.withScope((scope) => {
  scope.setTag("api/path", "/api/v1/order"); // 태그 수동 설정
  Sentry.captureException(new Error("Order Failed"));
});
```

이 방식은 **동료 개발자가 Sentry 스펙을 별도로 공부**해야 하며, 실수로 단서를 누락할 경우 누락되는 단점이 있었습니다.

### 3-2. 핵심 메커니즘: beforeSend를 활용한 단서 매핑

이를 해결하기 위해 개발자가 Sentry를 전혀 몰라도 되도록 구조를 변경했습니다.

가장 먼저, Sentry SDK의 **`beforeSend()`** 훅을 활용하여 **에러 전송 직전에 데이터를 가로채는 로직**을 구현했습니다.

```typescript
class ApiResponseError extends BaseError {
  // 이 에러에만 해당되는 단서 정의
  request;
  response;

  constructor(request, response) {
    super(...); // 모든 에러마다 공통되는 단서 설정
    this.request = request;
    this.response = response;
  }
}
```

[커밋 링크](https://github.com/developer-choi/best-practice/pull/3/commits/db687a418270579c67176f156a35383f54a426ff)

이제 Sentry는 어떤 에러가 들어오든, 그 에러 객체(originalException) 안에 담긴 정보를 뜯어서 보낼 준비가 되었습니다.

### 3-3. 에러 클래스 정의
개발자는 그저 약속된 규격에 맞춰 데이터를 담아주기만 하면 됩니다. 이를 위해 커스텀 에러 클래스를 정의했습니다.

```typescript
class ApiResponseError extends BaseError {
  request;
  response;

  constructor(request, response) {
    super(...); // 모든 에러마다 공통적으로 정의되는 속성 정의
    
    // 이 에러만 해당되는 단서 설정
    this.request = request;
    this.response = response;
  }
}
```

[커밋 링크](https://github.com/developer-choi/best-practice/pull/3/commits/8b3535b81f47d7307cce200d17dd472c1944694f)

### 3-4. 구현 결과: 관심사의 분리
이러한 추상화를 통해 개발자의 작업 방식이 단순해졌습니다.

> 개발자는 평소처럼 throw new CustomError()만 하면 끝. (데이터 매핑은 beforeSend가 담당)

결과적으로 Sentry를 위해 추가된 코드는 beforeSend() 설정 하나와, 에러 클래스의 단서 필드 몇 개가 전부입니다.

에러 클래스는 Sentry 여부와 무관하게 에러 핸들링을 위해 원래 필요한 코드이므로,

**Sentry 도입으로 인한 추가 개발 비용은 거의 발생하지 않았습니다.**

## 4. 실행 전략

### 4-1. 원인 기반의 이슈 통합
* **Before:** `GET /api/A (500)`, `GET /api/B (500)` $\to$ 서로 다른 이슈로 목록에 존재
* **After:** 모두 `ApiResponseError` 라는 하나의 오류로 통합

* **Before:** `GET /img/banner.png (404)`, `GET /js/bundle.js (Network Error)` $\to$ 서로 다른 이슈로 목록에 존재
* **After:** 모두 `ResourceLoadError` 라는 하나의 오류로 통합

이러한 추상화를 통해 **86종**에 달하던 이슈를 **20종 미만**으로 대폭 압축했습니다.

### 4-2. 문맥 정보의 자동 주입
원인이 같다면, 단서도 동일합니다.

앞서 개발한 `beforeSend` 덕분에, 개발자는 필드만 추가하면 됩니다.

**예시: 유효성 검증 실패 (ValidationError)**
```typescript
class ValidationError extends BaseError {
  input;    // 검증 실패한 원본 인자값 (Arguments)
  external; // 검증에 영향을 준 외부 상태 (ex: localStorage)
  output;   // 실행 결과 (Return Value)
}
```

### 4-3. 우선순위별 대응 정책 수립
* **Fatal:** 하던 일을 멈추고 **즉시 대응**해야 함. (예: 결제 실패)
* **Error:** **예상치 못한 버그.** 확인 후 적절한 등급으로 재분류.
* **Warning:** 대응은 해야 하지만, **당장 급하지 않은** 오류.
* **Info:** 평소엔 대응 불필요. (단, **단기간에 급증하는 경우**에만 확인)

## 5. 적용 성과
<img width="923" height="580" src="/docs/extra.png" />

* 86종의 Sentry 이슈를 해결하여 **1종**으로 줄였습니다.
* 풍부해진 단서 덕분에 원인을 쉽게 파악할 수 있게 되었습니다.
* **우선순위에 따라 긴급한 오류를 더 빠르게 인지**할 수 있게 되었습니다. (Fatal 등급만 Slack 알림 등)
* `beforeSend` 훅과 `Error Class` 필드 추가만으로 **짧고 쉽게 구현했습니다.**

### 지속 가능한 유지보수
앞으로 발생하는 에러도 적은 리소스로 관리할 수 있는 프로세스를 정착시켰습니다.

1. 새로운 원인의 에러 발생 시 $\to$ **새로운 Error Class 정의**
2. 단서가 부족할 경우 $\to$ **Error Class에 필드만 추가**

결과적으로 개발자는 Sentry 사용법을 몰라도, **에러 클래스 관리** 라는 쉬운 작업만으로 장애를 대응할 수 있게 되었습니다.

## 최종 목표: 버그 없는 서비스
Sentry는 이미 벌어진 일을 수습하는 도구일 뿐입니다.

궁극적인 목표는 **버그 없는 서비스**를 만드는 것입니다.

### Step 1. 예방
**배포 전** 오류를 차단하는 환경을 만들겠습니다.
1. **기획 단계 검증:** 기획 리뷰 시점부터 AI를 활용해 놓치기 쉬운 **엣지 케이스**를 사전에 검토하겠습니다.
2. **테스트 커버리지:** 테스트 코드를 작성하여 안정성을 더 확보하겠습니다.
3. **코드 리뷰 문화:** 리뷰의 질을 높이기 위해 **작은 단위 커밋, PR**과 AI 코드 리뷰 툴을 적극 활용하겠습니다.

### Step 2. 대응
**배포 후** 오류가 발생하더라도 사용자 경험을 방어하고 빠르게 해결하겠습니다.
1. 정상적인 플로우로 유도하여 사용자를 안심시키겠습니다.
2. Sentry를 통해 빠르게 대응하겠습니다.