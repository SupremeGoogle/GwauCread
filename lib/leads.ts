import { promises as fs } from "node:fs";
import path from "node:path";
import type { Lead } from "./types";

const leadsPath = path.join(process.cwd(), "data", "submissions.json");

export async function getLocalLeads(): Promise<Lead[]> {
  try {
    const raw = await fs.readFile(leadsPath, "utf-8");
    return JSON.parse(raw) as Lead[];
  } catch {
    return [];
  }
}

export async function saveLocalLead(lead: Lead): Promise<void> {
  try {
    const leads = await getLocalLeads();
    leads.unshift({
      ...lead,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    });
    if (leads.length > 200) leads.length = 200;
    await fs.writeFile(leadsPath, JSON.stringify(leads, null, 2), "utf-8");
  } catch {
    // Vercel has read-only fs — local save is best-effort
  }
}
