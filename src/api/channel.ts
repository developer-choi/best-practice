import {ChannelInfoApiResponse, VideoListApiResponse} from '@/types/channel';
import {baseFetch} from '@/utils/fetch';

export async function getChannelInfoApi(id: string) {
  const response = await baseFetch<ChannelInfoApiResponse>(`/channel/${id}/info`);
  return {data: response};
}

export async function getVideoListApi(id: string) {
  const response = await baseFetch<VideoListApiResponse>(`/channel/${id}/videos`);
  return {data: response};
}
