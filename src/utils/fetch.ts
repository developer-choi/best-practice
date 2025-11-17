/**
 * 임의의 API를 호출했을 때 공통적으로 적용할 전역 로직이 있는 경우
 * 모두 이 함수에 작성을 하려고 의도했으나,
 * 포트폴리오 제작에 필요한 만큼만 로직을 작성했습니다.
 */
export async function baseFetch<T>(path: string, init?: RequestInit) {
  const response = await fetch(`https://best-practice-alpha.vercel.app/api${path}`, init);
  return await response.json() as T;
}
