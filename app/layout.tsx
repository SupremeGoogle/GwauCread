import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "GwauCread - конструкторы и наборы для творчества",
  description: "Каталог тематических конструкторов и наборов GwauCread с формой заявки."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  );
}
