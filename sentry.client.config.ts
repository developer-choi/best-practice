// This file configures the initialization of Sentry on the client.
// The config you add here will be used whenever a users loads a page in their browser.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from '@sentry/nextjs';
import {beforeSend} from '@/utils/sentry';

Sentry.init({
  dsn: "https://6895395bf0a1a7eb9e33d4b61f234974@o4508301096714240.ingest.us.sentry.io/4510381991264256",
  beforeSend: beforeSend,
});
