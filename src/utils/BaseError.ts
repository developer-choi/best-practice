type SeverityLevel = 'fatal' | 'error' | 'warning' | 'log' | 'info' | 'debug';

export interface SentryOption {
  level: SeverityLevel;
}

/**
 * @description 모든 커스텀 에러에 공통적으로 적용되야하는 설계를 반영했습니다.
 * 그 중에서, 이번 포트폴리오 범위에 해당되는 속성만 넣었습니다.
 */
export default abstract class BaseError extends Error {
  readonly abstract name: string;
  readonly sentryOptions: SentryOption;

  protected constructor(message: string, option: SentryOption) {
    super(message);
    this.sentryOptions = option;
  }
}
