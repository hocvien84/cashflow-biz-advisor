import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Cashflow Matrix & Ikigai Biz Advisor | Tư Vấn Mô Hình Kinh Doanh Dòng Tiền",
  description:
    "Hệ thống tư vấn mô hình kinh doanh khai thác dòng tiền theo Ma trận 8 Độ Tuổi × 6 Nhu Cầu Maslow × 3 Phân Khúc, Định vị Bản đồ 0.2-2km và Ikigai Nhật Bản.",
  other: {
    google: "notranslate",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="vi"
      translate="no"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased notranslate`}
    >
      <body className="min-h-full flex flex-col notranslate">{children}</body>
    </html>
  );
}
