import { getProducts } from "@/lib/products";
import { getSettings } from "@/lib/settings";
import { HomePageContent } from "@/components/HomePageContent";

export default async function HomePage() {
  const [products, settings] = await Promise.all([getProducts(), getSettings()]);
  return <HomePageContent products={products} settings={settings} />;
}
