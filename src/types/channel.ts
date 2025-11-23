export interface ChannelInfoApiResponse {
  avatar: string;
  name: string;
  subscribersCount: number;
  banner: string;
}

export interface VideoListApiResponse {
  list: Video[];
}

export interface Video {
  id: number;
  thumbnail: string;
  title: string;
  viewCount: number;
}
