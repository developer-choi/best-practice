import {notFound} from 'next/navigation';
import {ApiResponseError} from '@/utils/ApiResponseError';
import ErrorPage from '@/components/ErrorPage';
import * as Sentry from '@sentry/nextjs';

export default function handleServerSideError(error: unknown) {
  switch (true) {
    case error instanceof ApiResponseError:
      if (error.response.status === 404) {
        notFound();
      }
  }

  Sentry.captureException(error);

  return (
    <ErrorPage>알 수 없는 오류가 발생했습니다. 오류가 지속될 경우, 고객센터에 문의해주세요.</ErrorPage>
  );
}
