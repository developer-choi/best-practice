'use client';

import Link, {LinkProps} from 'next/link';
import {MouseEvent, PropsWithChildren, useCallback} from 'react';

export default function PortfolioLink(props: PropsWithChildren<LinkProps> & {className?: string}) {
  const onClick = useCallback((event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    alert(`해당 URL은 포트폴리오 구현 범위가 아닙니다. 양해 부탁드리겠습니다.`);
  }, []);

  return (
    <Link {...props} onClick={onClick}/>
  );
}
