import type { Metadata } from "next";
import { getProducts } from "@/lib/products";
import { getSettings } from "@/lib/settings";
import { HomePageContent } from "@/components/HomePageContent";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  return {
    title: settings.metaTitle,
    description: settings.metaDescription,
    openGraph: {
      title: settings.metaTitle,
      description: settings.metaDescription,
      type: "website",
    },
  };
}

export default async function HomePage() {
  const [products, settings] = await Promise.all([getProducts(), getSettings()]);
  return <HomePageContent products={products} settings={settings} />;
}
