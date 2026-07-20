import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import { ClientProviders } from "@/components/providers/client-providers";
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
  title: "ThorFlow · 胸外科围术期医患流程协同平台",
  description:
    "帮助外科团队管理患者围术期全流程，医生与患者双向同步提醒，提高日常工作效率",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="zh-CN"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  );
}
