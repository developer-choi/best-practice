import {render, screen} from '@testing-library/react';
import Layout from './layout';
import {ChannelInfoApiResponse} from '@/types/channel';
import {getChannelInfoApi} from '@/api/channel';
import NotFoundPage from '@/app/(service)/channel/not-found';
import {ApiResponseError} from '@/utils/ApiResponseError';
import ErrorComponent from '@/app/(service)/error';

const MOCK_DATA: ChannelInfoApiResponse = {
  banner: '/banner.jpg',
  avatar: '/channel.jpg',
  name: 'Vercel',
  subscribersCount: 110,
};

jest.mock('@/api/channel');
const mockBaseFetch = jest.mocked(getChannelInfoApi);

describe('채널 레이아웃', () => {
  beforeEach(async () => {
    mockBaseFetch.mockResolvedValue({data: MOCK_DATA});
    render(await Layout({params: {id: '1'}}));
  });

  describe('성공하는 경우', () => {
    it('배너 이미지가 API에서 받은 src를 올바르게 렌더링해야 한다', async () => {
      expect(await screen.findByAltText('Channel Banner')).toHaveAttribute('src', MOCK_DATA.banner);
    });

    it('채널 정보(아바타, 이름, 구독자 수)를 올바르게 렌더링해야 한다', async () => {
      expect(await screen.findByAltText('Channel Avatar')).toHaveAttribute('src', MOCK_DATA.avatar);
      expect(screen.getByText(MOCK_DATA.name)).toBeInTheDocument();
      expect(screen.getByText(new RegExp(String(MOCK_DATA.subscribersCount)))).toBeInTheDocument();
    });
  });

  describe('실패하는 경우', () => {
    it('API에서 404를 제외한 다른 에러가 발생하는 경우, 에러페이지가 보여야한다.', async () => {
      mockBaseFetch.mockRejectedValue(new ApiResponseError({} as never, {status: 500} as Response));
      let component;
      try {
        await Layout({params: {id: '1'}});
      } catch (error) {
        component = ErrorComponent();
      }
      render(component);
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });

    it('API에서 404 에러가 발생하면, "존재하지 않는 채널" 페이지가 보여야 한다', async () => {
      mockBaseFetch.mockRejectedValue(new ApiResponseError({} as never, {status: 404} as Response));

      let component;
      try {
        await Layout({params: {id: '1'}});
      } catch (error) {
        const isNotFoundError = error !== null && typeof error === 'object' && 'message' in error && error.message === 'NEXT_NOT_FOUND';

        if (isNotFoundError) {
          component = NotFoundPage();
        } else {
          throw error;
        }
      }

      render(component);
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });
  });
});
