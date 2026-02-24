import { VideoType } from '../types/course';

export function detectVideoType(url: string): VideoType | null {
  if (!url) return null;
  if (url.includes('youtube.com') || url.includes('youtu.be')) return VideoType.YOUTUBE;
  if (url.includes('vimeo.com')) return VideoType.VIMEO;
  if (url.endsWith('.m3u8')) return VideoType.HLS;
  if (url.endsWith('.mp4')) return VideoType.MP4;
  return null;
}

export const VIDEO_JWT_TTL_SECONDS = 900; // 15 minutes default
export const VIDEO_JWT_REFRESH_THRESHOLD_SECONDS = 120; // refresh when < 2 min left
