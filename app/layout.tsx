import type { Metadata } from "next";
import "./globals.css";

const baseUrl = "https://gwau-cread.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "GwauCread — конструкторы и наборы для творчества",
    template: "%s | GwauCread",
  },
  description: "Каталог тематических конструкторов и наборов GwauCread с формой заявки.",
  openGraph: {
    siteName: "GwauCread",
    locale: "ru_RU",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
  },
  robots: "index, follow",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  );
}
