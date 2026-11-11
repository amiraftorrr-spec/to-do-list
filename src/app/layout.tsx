import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { ServiceWorkerRegister } from "@/components/pwa/ServiceWorkerRegister";

const shabnam = localFont({
  src: [
    {
      path: "./fonts/Shabnam-Thin.woff2",
      weight: "100",
      style: "normal",
    },
    {
      path: "./fonts/Shabnam-Light.woff2",
      weight: "300",
      style: "normal",
    },
    {
      path: "./fonts/Shabnam.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "./fonts/Shabnam-Medium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "./fonts/Shabnam-Bold.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-shabnam",
  display: "swap",
});

export const metadata: Metadata = {
  title: "tedlist — لیست کارها",
  description: "مدیریت ساده، سریع و آفلاین کارهای روزانه — tedlist",
  applicationName: "tedlist",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "tedlist",
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    icon: [
      { url: "/favicon.png", sizes: "64x64", type: "image/png" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
};

export const viewport: Viewport = {
  themeColor: "#090d16",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="fa"
      dir="rtl"
      className={`dark ${shabnam.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[var(--color-background)] text-[var(--color-foreground)]">
        <ServiceWorkerRegister />
        {children}
      </body>
    </html>
  );
}
