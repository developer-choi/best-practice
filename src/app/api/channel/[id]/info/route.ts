import {timeoutPromise} from '@/utils/promise';
import {ChannelInfoApiResponse} from '@/types/channel';
import {NextRequest} from 'next/server';

export async function GET(_: NextRequest, {params: {id}}: {params: {id: string}}) {
  await timeoutPromise(100);

  if(id !== '1') {
    return new Response('', {
      status: 404
    });
  }

  const response: ChannelInfoApiResponse = {
    banner: '/banner.jpg',
    avatar: '/channel.jpg',
    name: 'Vercel',
    subscribersCount: 110,
  };

  return Response.json(response);
}
