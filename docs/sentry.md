# 장애 대응 프로세스 구축 및 Sentry 이슈 98% 해결

## 문제
1. 선생님이 오류를 제보했지만, 재현이 되지않아 개발자도구 캡처를 요청드려야 하는 상황이었습니다.
2. 구매페이지 로딩이 안되는 오류가 발생했고, 개발팀에서 늦게 인지하여 대응이 늦어지는 바람에 2,000만원 상당의 피해를 봤습니다.

## 처한 상황
1. Sentry에 86종의 이슈가 방치되어있었고,
2. 문제를 해결할 단서 데이터가 없었고,
3. 방치된 이슈들의 에러등급이 모두 error 였습니다.

새로운 이슈가 올라와도 똑같이 error 등급이어서 우선순위 판단이 안됐고,

애초에 인지도 잘 안됐습니다. 근본적으로 목록 자체가 많기 때문입니다.

슬랙, 메일 모니터링같은것도 설정할 수 없었습니다. 이슈를 구분지을만한 무언가가 없었기 때문입니다.

## 해결방법
1. 근본적으로 이슈 목록을 좀 줄이자
2. 이슈마다 우선순위를 설정해서 더 급한 오류를 먼저 처리할 수 있게 하자
3. 이슈를 해결할 단서를 풍부하게 첨부하자
4. 마지막으로, 목록에 있던 오류들을 실제로 해결하자
5. 구현하는 방법은, Sentry를 모르는 동료도 유지보수 할 수 있게 하자

로 로드맵을 작성했습니다.

## 구현방법
### Sentry로 단서를 제공하는 기존 방법은?
```typescript
Sentry.withScope((scope) => {
  scope.setTag("my-tag", "my value");
  Sentry.captureException(new Error("my error"));
});
```
에러를 던지는곳 마다 매번 저렇게 작성을 해야했습니다.

저렇게 개발한다면 동료 개발자가 Sentry 스펙을 공부해야하는 단점이 있었습니다.

### 에러클래스 기반의 처리방법 도입
```typescript
export class ApiResponseError extends Error {
  level: 'fatal' | 'error';
}
```
JS에서 에러처리하는 유명한 방법인 에러클래스를 만들고,

Sentry 옵션에 전달할 수 있는 beforeSend() 으로

Sentry로 에러를 보내기 직전에 에러인스턴스의 필드를 실어서 보내기로 했습니다.
```typescript
export function beforeSend(event, hint) {
  event.extra.original = hint.originalException;
  event.level = hint.originalException.level;
  return event;
}
```

이렇게 되면, 개발자의 관심사는

에러클래스에 단서를 풍부하게 만들기로 좁혀지게 됩니다.

```typescript
export class ApiResponseError extends BaseError {
  request: BaseApiRequest;
  response: BaseApiResponse;

  constructor(request, response) {
    super(...);
    this.request = request;
    this.response = response;
  }
}
```

### 구현 결과

> Sentry를 위해 추가한 코드는 결국 beforeSend()와 Sentry로 보낼 필드 몇개밖에 없었습니다.

1. 에러클래스는 굳이 Sentry가 아니어도 원래 있어야 하는 코드고,
2. 에러를 던지기, 처리하기 역시 Sentry가 아니어도 원래 있어야 하는 코드입니다.
3. 개발자는 에러클래스의 필드만 관리하면되서 **아주 적은 개발리소스**만 들어갑니다.

## 적용방법

### 이슈 목록을 어떻게 줄일것인가?
먼저 원인이 같은 이슈 끼리 개념적으로 묶었습니다.

1. GET /api/some/path1 호출했는데 500에러 난 이슈
2. GET /api/some/path2 호출했는데 422에러 난 이슈

이런건 모두 "API에서 에러 응답을 한 오류"로 정의하는 식으로 진행했습니다.

1. 유효성검증 하다 실패함 ==> ApiResponseError
2. 이미지, 동영상, JS파일 불러오다 실패함 ==> ResourceLoadError

이런식으로 같은 원인에 의해 발생한 이슈들을 묶어보니 **86종**에서 **30종** 밑으로 줄었습니다.

### 단서를 어떻게 풍부하게 제공할것인가?
원인이 같으면, 단서도 동일합니다.

그 원인과 에러클래스가 1대1 매칭으로 되어있기 때문에,

해결하는데 필요한 모든 데이터를 에러클래스의 필드로 추가하기만 하면 알아서 beforeSend()를 통해 Sentry로 날아갑니다.

예를들어, 유효성검증 에러를 던지고 싶다면

```typescript
```typescript
class ValidationError extends BaseError {
  input;
  external;
  output;
}
```
이렇게 단서를 필드로 추가하고 던지면 됩니다.

### 우선순위를 어떻게 정의할것인가?

PM과 상의 후 Sentry에서 제공하는 level을 아래와같이 구체적으로 정의했습니다.

- **fatal**: 하던 일 멈춰서라도 대응해야함 (ex: 결제오류)
- **error**: unhandled 오류만 이 level을 사용하기로 하고, 다른 오류는 절대 이 등급을 사용하지않기로 했습니다. (= 예상하지 못한 오류)
- **warning**: 대응은 해야하지만, 지금 당장 안해도 되는 오류
- **info**: 아주 많이 발생하는 경우에만 대응해야하는 오류 (ex: 공지사항 게시글 1개 가져오다 404 오류 뜬 경우)

이를 통해, fatal인 경우 슬랙으로 알림이 오게 하였고,

개발자는 오류 등급을 보고 더 급한걸 우선 대응할 수 있는 체계를 갖추었습니다.

### 오류 해결
1. 원인이 같은 이슈들 마다
2. 풍부하게 첨부된 단서를 보고
3. 오류를 해결하고 Resolve 처리를 한 끝에

86종의 Sentry 이슈가 1종으로 줄어들게 되었습니다.

### 모니터링 방법
앞으로 새로운 에러가 등장하면,

1. 기존 에러클래스에 없는 원인으로 발생했으면 새로 에러클래스 만들고,
2. 단서가 부족하면 필드 추가하고,
3. 해결하고 Resolve 하고,

결국 개발리소스가 크게 줄어들었습니다.

# 다음 목표
**버그없는 프로그램**을 만드는 것입니다.

### Step 1. 배포 전에 오류 없는 서비스를 만드는 방법
1. 처음부터 잘 만들기
2. 테스트코드 잘 작성하기
3. 코드리뷰 잘 하기

### Step 2. 배포 하고나서 오류가 발생해도 잘 대응하는 방법
1. 사용자를 안심시키고 정상 플로우로 유도하기
2. 뒤에서는 Sentry로 로그 보내서 얼른 해결하기

Sentry는 최종 목표를 달성하기위한 일부 입니다.
