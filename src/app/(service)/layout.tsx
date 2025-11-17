import React, {ReactNode} from 'react';
import '@/styles/reset.css';
import '@/styles/global.css';
import styles from './layout.module.css';
import BaseImage from '@/components/BaseImage';
import PortfolioLink from '@/components/PortfolioLink';

export interface RootLayoutProps {
  children?: ReactNode;
}

export default function RootLayout({children}: RootLayoutProps) {
  return (
    <>
      <Header/>
      <div className={styles.layoutContainer}>
        <Sidebar/>
        <div className={styles.pageContainer}>
          {children}
        </div>
      </div>
    </>
  );
}

function Header() {
  return (
    <header className={styles.headerContainer}>
      <div className={styles.headerLeft}>
        <BaseImage src="/menu.svg" width={24} height={24} alt="Menu"/>
        <PortfolioLink href="/" aria-label="YouTube Home">
          <BaseImage src="/logo.svg" width={93} height={20} alt="YouTube Logo"/>
        </PortfolioLink>
      </div>
    </header>
  );
}

function Sidebar() {
  return (
    <aside className={styles.sidebarContainer}>
      <nav aria-label="Main navigation">
        <ul>
          <li>
            <PortfolioLink href="/" className={styles.sidebarItem}>
              <BaseImage src="/home.svg" width={24} height={24} alt="home icon"/>
              <span>Home</span>
            </PortfolioLink>
          </li>
          <li>
            <PortfolioLink href="/shorts" className={styles.sidebarItem}>
              <BaseImage src="/shorts.svg" width={24} height={24} alt="shorts icon"/>
              <span>Shorts</span>
            </PortfolioLink>
          </li>
          <li>
            <PortfolioLink href="/subscriptions" className={styles.sidebarItem}>
              <BaseImage src="/subscriptions.svg" width={24} height={24} alt="subscription icon"/>
              <span>Subscriptions</span>
            </PortfolioLink>
          </li>
        </ul>
      </nav>
    </aside>
  );
}