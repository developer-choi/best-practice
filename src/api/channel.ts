import {ChannelInfoApiResponse, VideoListApiResponse} from '@/types/channel';

export function getChannelInfoApi() {
  const response: ChannelInfoApiResponse = {
    banner: '/banner.jpg',
    avatar: '/channel.jpg',
    name: 'Vercel',
    subscribersCount: 110,
  };

  return {data: response};
}

export function getVideoListApi() {
  const response: VideoListApiResponse = {
    list: Array.from({length: 12}).map((_, i) => ({
      id: i,
      thumbnail: `/video${i % 2}.avif`,
      title: `Vercel Ship 2024 Day 1: The Keynote - Video ${i + 1}`,
      viewCount: 123,
    }))
  };

  return {data: response};
}
