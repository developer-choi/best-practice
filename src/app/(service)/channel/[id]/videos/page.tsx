'use client';

import BaseImage from '@/components/BaseImage';
import styles from './page.module.css';
import PortfolioLink from '@/components/PortfolioLink';
import {getVideoListApi} from '@/api/channel';
import {useSuspenseQuery} from '@tanstack/react-query';

export default function Page({params: {id}}: {params: {id: string}}) {
  const {data: response} = useSuspenseQuery({
    queryKey: ['videos', id],
    queryFn: () => getVideoListApi(id),
  });

  const data = response.data;

  return (
    <main className={styles.pageContainer}>
      {data.list.length === 0 ? (
        <div role="status">비디오 목록이 없어요</div>
      ) : (
        <ul className={styles.listContainer}>
          {data.list.map((video) => {
            const href = `/watch?v=${video.id}`;

            return (
              <li key={video.id} className={styles.videoItem}>
                <PortfolioLink href={href} className={styles.thumbnailContainer}>
                  <BaseImage src={video.thumbnail} alt={video.title} width={336} height={188} className={styles.videoThumbnail}/>
                </PortfolioLink>
                <div className={styles.videoDetails}>
                  <PortfolioLink href={href} className={styles.titleLink}>
                    <h3 className={styles.videoTitle}>{video.title}</h3>
                  </PortfolioLink>
                  <div className={styles.videoMetadata}>{video.viewCount} views</div>
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </main>
  );
}
