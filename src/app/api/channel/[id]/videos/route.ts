import {timeoutPromise} from '@/utils/promise';
import {Video, VideoListApiResponse} from '@/types/channel';

export async function GET() {
  await timeoutPromise(200);

  const response: VideoListApiResponse = {
    list: new Array(12).fill(0).map((_, index) => {
      const type = index % 3;
      const video = type === 0 ? VIDEO0 : type === 1 ? VIDEO1 : VIDEO2

      return {
        id: index + 1,
        ...video
      };
    }),
  };

  return Response.json(response);
}

const IMAGE = [
  '/video0.avif',
  '/video1.avif',
  '/video2.avif',
];

const VIDEO0: Omit<Video, 'id'> = {
  thumbnail: IMAGE[0],
  title: 'AWS + Vercel: Accelerate AI to prod',
  viewCount: 600
};

const VIDEO1: Omit<Video, 'id'> = {
  thumbnail: IMAGE[1],
  title: 'Type-safe URL state in Next.js with nuqs',
  viewCount: 310
};

const VIDEO2: Omit<Video, 'id'> = {
  thumbnail: IMAGE[2],
  title: 'Agents at Work',
  viewCount: 575
};
