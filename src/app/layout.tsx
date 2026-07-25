import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "대한민국 2026 월드컵 시뮬레이터",
  description:
    "대한민국 국가대표팀 감독이 되어 전술을 설계하고 월드컵 우승에 도전하는 감독 시뮬레이션",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}