'use client';

import React, {type ReactNode, Suspense} from 'react';
import styles from './layout.module.css';
import {ChannelInfoApiResponse} from '@/types/channel';
import BaseImage from '@/components/BaseImage';
import classNames from 'classnames';
import PortfolioLink from '@/components/PortfolioLink';
import {getChannelInfoApi} from '@/api/channel';
import {useSuspenseQuery} from '@tanstack/react-query';

export interface ChannelLayoutProps {
  children?: ReactNode;
  params: {id: string};
}

export default function ChannelLayout({children, params}: ChannelLayoutProps) {
  return (
    <div className={styles.container}>
      <header>
        <Suspense fallback={<LayoutSkeleton />}>
          <Data id={params.id}/>
        </Suspense>
      </header>
      {children}
    </div>
  );
}

function LayoutSkeleton() {
  return (
    <>
      <div className={classNames(styles.channelBanner, styles.skeletonBox)} style={{height: 211, marginBottom: 16}}/>
      <div className={styles.channelHeaderContent}>
        <div className={classNames(styles.channelAvatar, styles.skeletonBox)} style={{width: 160, height: 160}}/>
        <div>
          <div className={classNames(styles.skeletonBox)} style={{width: 200, height: 36, marginBottom: 16}}/>
          <div className={classNames(styles.skeletonBox)} style={{width: 100, height: 20}}/>
        </div>
      </div>
      <nav>
        <ul className={styles.channelTabs}>
          {TABS.map(tab => (
            <li key={tab.path} className={styles.tabItem}>
              <div className={styles.skeletonBox} style={{width: 50, height: 20}}/>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
}

function Data({id}: {id: string}) {
  const {data: response} = useSuspenseQuery({
    queryKey: ['channel', id],
    queryFn: () => getChannelInfoApi(id),
  });

  const data = response.data;

  return (
    <>
      <BaseImage src={data.banner} alt="Channel Banner" className={styles.channelBanner} width={1284} height={207}/>
      <ChannelInfo info={data}/>
      <ChannelTabs id={id}/>
    </>
  )
}

function ChannelInfo({info}: {info: Pick<ChannelInfoApiResponse, 'avatar' | 'subscribersCount' | 'name'>}) {
  return (
    <div className={styles.channelHeaderContent}>
      <BaseImage className={styles.channelAvatar} src={info.avatar} alt="Channel Avatar" width={120} height={120}/>
      <div>
        <p className={styles.channelName}>{info.name}</p>
        <span>{info.subscribersCount} subscribers</span>
      </div>
    </div>
  );
}

function ChannelTabs({id}: {id: string;}) {
  return (
    <nav>
      <ul className={styles.channelTabs}>
        {TABS.map(tab => (
          <li key={tab.path} className={classNames(styles.tabItem, {[styles.active]: tab.path === '/videos'})}>
            <PortfolioLink href={`/channel/${id}${tab.path}`}>{tab.name}</PortfolioLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}

const TABS: {name: string, path: string;}[] = [
  {
    name: 'Home',
    path: '/',
  },
  {
    name: 'Videos',
    path: '/videos',
  },
  {
    name: 'Shorts',
    path: '/shorts',
  },
  {
    name: 'Live',
    path: '/live',
  },
  {
    name: 'Playlists',
    path: '/playlists',
  },
  {
    name: 'Community',
    path: '/community',
  },
  {
    name: 'About',
    path: '/about',
  },
];
