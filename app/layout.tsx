import type { Metadata, Viewport } from "next";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

export const metadata: Metadata = {
  title: {
    default: "THE DAWN — 깊은 말씀, 새로운 새벽",
    template: "%s · THE DAWN",
  },
  description:
    "2026 사랑의교회 가을 글로벌 특별새벽부흥회의 말씀을 이해하고 묵상하며 삶에 새기도록 돕는 독립 성경 학습 동반자. 교회 공식 서비스가 아닙니다.",
  applicationName: "THE DAWN",
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#1f2b3b",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

/** 같은 세션에서 이미 입장했다면 첫 페인트 전에 문을 숨긴다 */
const entranceScript = `try{if(sessionStorage.getItem("dawn:entered"))document.documentElement.dataset.entered="1"}catch(e){}`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: entranceScript }} />
      </head>
      <body className="min-h-dvh flex flex-col">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[200] focus:bg-paper focus:px-4 focus:py-2"
        >
          본문으로 건너뛰기
        </a>
        <SiteHeader />
        <main id="main" className="flex-1">
          {children}
        </main>
        <SiteFooter />
      </body>
    </html>
  );
}
