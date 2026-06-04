import { NextResponse } from "next/server";
import { getProducts } from "@/lib/products";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(await getProducts());
}
