# Summary
실무에서 **86종의 이슈를 1종으로** 줄인 성과를 보여드리기 위해, 예시를 구현했습니다.

---

# Key Process & Decisions

## 1. Problem Definition
Sentry 도입 전, 해결하고자 하는 문제를 먼저 정의하고 시작했습니다.

* 모든 이슈가 `Priority High`로 설정되어 있어, 긴급 여부를 구분할 수 없었습니다.
* 에러 발생 시 단서가 부족하여, 유저에게 개발자도구 캡처를 요청해야 하는 문제가 있었습니다.

## 2. Research Process
* 공식 문서 전체를 가볍게 훑어본 뒤, 당장 필요한 기능 위주로 정독했습니다.
* 이후 대기업의 기술 블로그도 확인했습니다.

## 3. Error Policy Strategy
* 86종의 이슈들을 특징(Network, API, Resource 등)에 따라 그룹화했습니다.
  각 그룹별로 필요한 디버깅 단서와 에러 등급(Level)을 정의했습니다.
* 정의된 등급에 따라 차등 대응책을 마련했습니다. (e.g., `Fatal` 등급은 Slack 알림을 연동하여 주말에도 대응)

## 4. Architecture Decision: Class-based Error Handling

### 1. Context: Existing Pipeline
모든 프로젝트에는 에러를 처리하는 기본적인 구조가 반드시 존재합니다.

* [비즈니스 로직 어딘가에서 에러를 발생시키는 지점이 있고, (링크)](https://github.com/developer-choi/best-practice/blob/master/src/utils/fetch.ts)
* [이를 포착하여 공통으로 처리하는 핸들러 또한 반드시 존재합니다. (링크)](https://github.com/developer-choi/best-practice/commit/bf67142e86b6cb7023fd35ea5e10a7fd44343f67)

### 2. Implementation
에러 클래스를 정의하는 방식을 택했습니다.

* [에러 객체 생성 시점에 Sentry 설정값을 주입하고, (링크)](https://github.com/developer-choi/best-practice/pull/3/commits/8b3535b81f47d7307cce200d17dd472c1944694f)
* [에러가 전송되기 직전에 Sentry와 연동만 진행했습니다. (링크)](https://github.com/developer-choi/best-practice/pull/3/commits/db687a418270579c67176f156a35383f54a426ff)

### 3. Impact: Universality
결과적으로, **새로운 로직을 거의 추가하지 않고** Sentry를 연동했습니다.

본 예시에서는 `handleServerSideError`라는 함수를 사용했지만, **에러 처리 구조가 달라도 상관없습니다.**

어떤 프로젝트든 에러를 처리하는 곳은 반드시 존재하기 때문에, **`Error Class`를 정의하고 `beforeSend`만 연결한다면** 이 방식을 적용할 수 있습니다.

### Decision: Why Class?
* **Developer Experience:** 익숙한 Class 문법을 활용하여, 별도의 Sentry 학습 없이도 쉽게 사용할 수 있도록 했습니다.
* **Functionality:** 에러 등급(Level)이나 추가 정보(Extra) 등 Sentry에 필요한 메타데이터를 전달하기 위함입니다.

## 5. Monitoring Workflow (Triage Process)
[Sentry Triage Docs (링크)](https://docs.sentry.io/product/issues/states-triage/#manually-triaging-issues)를 기반으로 이슈 모니터링 가이드를 정립했습니다.

핵심은 **에러 클래스의 유지보수**입니다.

### Step 1. Detection
* Slack 알림 또는 수동 대시보드 모니터링을 통해 이슈를 인지합니다.

### Step 2. Triage & Review
* 해결 불가능하거나(서드파티 문제), 비즈니스 임팩트가 낮은 이슈는 **Archive** 처리하여
* 이슈목록을 항상 짧게 유지합니다.

### Step 3. Grouping
* 신규 이슈 발생 시 기존 에러 그룹에 편입 가능한지 확인합니다.
* 새로운 유형의 에러라면, 이에 매칭되는 **새로운 Error Class**를 정의하여 관리합니다.

### Step 4. Enrichment
* 해결을 위한 단서가 부족할 경우, 해당 Error Class에 field로 단서를 추가합니다.

### Step 5. Resolution
* 수정 배포 후 **Resolve** 처리하여, 이슈목록을 짧게 유지합니다.