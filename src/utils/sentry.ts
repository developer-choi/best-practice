import {EventHint, ErrorEvent} from '@sentry/nextjs';
import BaseError from '@/utils/BaseError';

export function beforeSend(event: ErrorEvent, hint: EventHint) {
  if (!event.extra) {
    event.extra = {};
  }

  event.extra.original = hint.originalException;

  if (!(hint.originalException instanceof BaseError)) {
    return event;
  }

  const {sentryOptions} = hint.originalException;
  event.level = sentryOptions.level;

  return event;
}
