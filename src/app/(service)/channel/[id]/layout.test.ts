import {render, screen} from '@testing-library/react';
import Layout from './layout';
import '@testing-library/jest-dom';
import {ChannelInfoApiResponse} from '@/types/channel';

jest.mock('@/utils/fetch', () => ({
  baseFetch: jest.fn().mockResolvedValue({
    info: {
      banner: '/banner.jpg',
      avatar: '/channel.jpg',
      name: 'Vercel',
      subscribersCount: 110,
    },
  } satisfies ChannelInfoApiResponse),
}));

describe('Channel Layout', () => {
  beforeEach(async () => {
    render(await Layout({params: {id: '1'}}));
  });

  describe('API 응답이 성공 한 경우', () => {
    it('배너 이미지가 API에서 받은 src를 올바르게 렌더링해야 한다', async () => {
      const bannerImage = await screen.findByAltText('Channel Banner');
      expect(bannerImage).toHaveAttribute('src', '/banner.jpg');
    });

    it('채널 정보(아바타, 이름, 구독자 수)를 올바르게 렌더링해야 한다', async () => {
      const avatarImage = await screen.findByAltText('Channel Avatar');
      expect(avatarImage).toHaveAttribute('src', '/channel.jpg');

      const nameElement = screen.getByText('Vercel');
      expect(nameElement).toBeInTheDocument();

      const subscribersElement = screen.getByText(/110 subscribers/i);
      expect(subscribersElement).toBeInTheDocument();
    });
  });
});
