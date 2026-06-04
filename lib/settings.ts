import { promises as fs } from "node:fs";
import path from "node:path";

export type Settings = {
  heroEyebrow: string;
  heroTitle: string;
  heroLead: string;
  heroPanel: string;
  catalogEyebrow: string;
  catalogTitle: string;
  catalogDesc: string;
  contactEyebrow: string;
  contactTitle: string;
  contactDesc: string;
  footerTagline: string;
};

const settingsPath = path.join(process.cwd(), "data", "settings.json");

export async function getSettings(): Promise<Settings> {
  const raw = await fs.readFile(settingsPath, "utf-8");
  return JSON.parse(raw) as Settings;
}

export async function saveSettings(settings: Settings): Promise<void> {
  await fs.writeFile(settingsPath, JSON.stringify(settings, null, 2), "utf-8");
}
