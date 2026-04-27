import type { Metadata } from "next";
import "./globals.css";
import "../styles/print.css";

export const metadata: Metadata = {
  title: "請求書ジェネレーター",
  description: "請求書を編集しながらリアルタイムでプレビューできます。"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
