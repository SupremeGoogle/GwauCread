import { promises as fs } from "node:fs";
import path from "node:path";
import type { Product } from "./types";

const productsPath = path.join(process.cwd(), "data", "products.json");

export async function getProducts(): Promise<Product[]> {
  const raw = await fs.readFile(productsPath, "utf-8");
  return JSON.parse(raw) as Product[];
}
