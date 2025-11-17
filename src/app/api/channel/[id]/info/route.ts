import {timeoutPromise} from '@/utils/promise';
import {ChannelInfoApiResponse} from '@/types/channel';

export async function GET() {
  await timeoutPromise(100);

  const response: ChannelInfoApiResponse = {
    banner: '/banner.jpg',
    avatar: '/channel.jpg',
    name: 'Vercel',
    subscribersCount: 110,
  };

  return Response.json(response);
}
