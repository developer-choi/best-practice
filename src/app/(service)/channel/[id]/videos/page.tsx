'use client';

import BaseImage from '@/components/BaseImage';
import styles from './page.module.css';
import PortfolioLink from '@/components/PortfolioLink';
import {getVideoListApi} from '@/api/channel';
import {useSuspenseQuery} from '@tanstack/react-query';
import {useParams} from 'next/navigation';

export default function Page() {
  const params = useParams<{id: string}>();
  const {data: {data: {list}}} = useSuspenseQuery({
    queryKey: ['channel', params.id, 'videos'],
    queryFn: () => getVideoListApi(params.id),
  });

  return (
    <main className={styles.pageContainer}>
      {list.length === 0 ? (
        <div role="status">비디오 목록이 없어요</div>
      ) : (
        <ul className={styles.listContainer}>
          {list.map((video) => {
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
            );
          })}
        </ul>
      )}
    </main>
  );
}
