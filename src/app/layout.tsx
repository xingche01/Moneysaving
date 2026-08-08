import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Ledgerly · 个人记账",
  description: "一个简单、私密的个人记账工具。",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="zh-CN"><body>{children}</body></html>;
}
