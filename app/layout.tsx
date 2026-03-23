import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geist = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Pipeline Gap Calculator | Pipeline Engine",
  description: "Find out exactly how many qualified conversations you need every month to hit your revenue target — and how big your current gap is.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geist.variable} h-full`}>
      <body className="min-h-full flex flex-col antialiased bg-bg-base text-text-primary">
        {children}
      </body>
    </html>
  );
}
