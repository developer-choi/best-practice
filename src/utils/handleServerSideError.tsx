import ErrorPage from '@/components/ErrorPage';
import {notFound} from 'next/navigation';

// TODO 이 오류무시 부분은 이후 PR에서 삭제예정
// eslint-disable-next-line
export default function handleServerSideError(error: unknown) {
  // TODO 다음 PR에서 이 부분을 개선할 예정입니다.
  const isNotFoundError = (error as Response).status === 404;

  if (isNotFoundError) {
    notFound();
  }

  const isSomeSpecificError = false;

  if (isSomeSpecificError) {
    return (
      <ErrorPage>임의의 API에서 공통적으로 발생할 수 있는 특정 에러에 대한 에러메시지 노출</ErrorPage>
    );
  }

  return (
    <ErrorPage>알 수 없는 오류가 발생했습니다. 오류가 지속될 경우, 고객센터에 문의해주세요.</ErrorPage>
  );
}
