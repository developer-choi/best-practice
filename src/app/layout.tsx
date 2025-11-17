import {PropsWithChildren} from 'react';
import {Noto_Sans_KR} from 'next/font/google';

const notoSansKr = Noto_Sans_KR({
  subsets: ['latin'],
  weight: ['400', '700'],
});

export default function RootLayout({children}: PropsWithChildren) {
  return (
    <html lang="ko">
    <body className={notoSansKr.className}>
    {children}
    </body>
    </html>
  );
}
