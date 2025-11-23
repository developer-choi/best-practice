import {render, screen} from '@testing-library/react';
import Page from './page';
import {VideoListApiResponse} from '@/types/channel';
import {ApiResponseError} from '@/utils/ApiResponseError';
import {getVideoListApi} from '@/api/channel';
import NotFoundPage from '@/app/(service)/channel/not-found';

const MOCK_VIDEOS: VideoListApiResponse = {
  list: [
    {
      id: 1,
      title: 'Next.js 15 RC',
      thumbnail: '/thumb1.jpg',
      viewCount: 10000,
    },
    {
      id: 2,
      title: 'Vercel Ship Keynote',
      thumbnail: '/thumb2.jpg',
      viewCount: 5000,
    },
  ],
};

jest.mock('@/api/channel');
const mockBaseFetch = jest.mocked(getVideoListApi);

describe('채널 레이아웃 하위 비디오 페이지', () => {
  beforeEach(() => {
    mockBaseFetch.mockClear();
  });

  describe('성공하는 경우', () => {
    beforeEach(async () => {
      mockBaseFetch.mockResolvedValue({data: MOCK_VIDEOS});
      render(await Page({params: {id: '1'}}));
    });

    it('비디오 제목과 조회수가 올바르게 렌더링되어야 한다', () => {
      MOCK_VIDEOS.list.forEach((video) => {
        expect(screen.getByText(video.title)).toBeInTheDocument();
        expect(screen.getByText(new RegExp(String(video.viewCount)))).toBeInTheDocument();
      });
    });

    it('비디오 썸네일 이미지가 올바른 src와 alt를 가져야 한다', () => {
      MOCK_VIDEOS.list.forEach((video) => {
        const thumbnail = screen.getByRole('img', {name: video.title});
        expect(thumbnail).toHaveAttribute('src', video.thumbnail);
      });
    });

    it('비디오 클릭 시 올바른 링크로 이동해야 한다', () => {
      MOCK_VIDEOS.list.forEach((video) => {
        const links = screen.getAllByRole('link', {name: video.title});
        links.forEach((link) => {
          expect(link).toHaveAttribute('href', `/watch?v=${video.id}`);
        });
      });
    });
  });

  describe('범위 경계 테스트', () => {
    beforeEach(async () => {
      mockBaseFetch.mockResolvedValue({data: {list: []}});
      render(await Page({params: {id: '1'}}));
    });

    it('비디오 목록이 0개인 경우, 안내 메시지를 렌더링해야 한다', () => {
      expect(screen.getByRole('status')).toBeInTheDocument();
    });
  });

  describe('실패하는 경우', () => {
    it('API에서 404를 제외한 다른 에러가 발생하는 경우, 에러페이지가 보여야한다.', async () => {
      mockBaseFetch.mockRejectedValue(new ApiResponseError({} as never, {status: 500} as Response));
      render(await Page({params: {id: '1'}}));
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });

    it('API에서 404 에러가 발생하면, "존재하지 않는 채널" 페이지가 보여야 한다', async () => {
      mockBaseFetch.mockRejectedValue(new ApiResponseError({} as never, {status: 404} as Response));

      let component;
      try {
        component = await Page({params: {id: '1'}});
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
