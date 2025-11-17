import {ChannelInfoApiResponse} from '@/types/channel';

export function getChannelInfoApi() {
  const response: ChannelInfoApiResponse = {
    banner: '/banner.jpg',
    avatar: '/channel.jpg',
    name: 'Vercel',
    subscribersCount: 110,
  };

  return {data: response};
}
