import Papa from 'papaparse';
import type { CommunityProject, CommunityProjectFormValues } from '../types/community-projects';

function normalizeKey(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, '');
}

function cleanString(value: unknown) {
  if (typeof value === 'string') {
    return value.trim();
  }

  if (value === null || value === undefined) {
    return '';
  }

  return String(value).trim();
}

function pickField(row: Record<string, unknown>, aliases: string[]) {
  const entries = Object.entries(row).map(([key, value]) => [normalizeKey(key), cleanString(value)] as const);
  const lookup = new Map(entries);

  for (const alias of aliases) {
    const value = lookup.get(normalizeKey(alias));
    if (value) {
      return value;
    }
  }

  return '';
}

function mapRowToProject(row: Record<string, unknown>, index: number): CommunityProject {
  const name = pickField(row, ['Name', 'Author', 'Submitted By', 'Creator']) || 'Anonymous';
  const title = pickField(row, ['Project Title', 'Title', 'Project', 'Name']) || `Project ${index + 1}`;
  const description = pickField(row, ['Description', 'Project Description', 'Summary']) || 'No description provided.';
  const wokwiLink = pickField(row, ['Wokwi Link', 'Wokwi', 'Link', 'URL', 'Project Link']);

  const raw: Record<string, string> = Object.fromEntries(
    Object.entries(row).map(([key, value]) => [key, cleanString(value)])
  );

  return {
    id: `${index}-${normalizeKey(name)}-${normalizeKey(title)}`,
    name,
    title,
    description,
    wokwiLink,
    raw
  };
}

export async function fetchCommunityProjects(csvUrl: string): Promise<CommunityProject[]> {
  const response = await fetch(csvUrl, {
    cache: 'no-store'
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch projects from Google Sheets CSV (${response.status})`);
  }

  const csvText = await response.text();
  const parsed = Papa.parse<Record<string, unknown>>(csvText, {
    header: true,
    skipEmptyLines: true,
    transformHeader: header => header.trim()
  });

  if (parsed.errors.length > 0) {
    const message = parsed.errors[0]?.message || 'CSV parse failed';
    throw new Error(message);
  }

  return parsed.data.map(mapRowToProject);
}

export async function submitCommunityProject(
  submissionUrl: string,
  payload: CommunityProjectFormValues
): Promise<unknown> {
  const response = await fetch(submissionUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  const contentType = response.headers.get('content-type') || '';
  const isJson = contentType.includes('application/json');

  if (!response.ok) {
    const body = isJson ? await response.json().catch(() => null) : await response.text().catch(() => '');
    const message = typeof body === 'string' ? body : body?.message || 'Project submission failed';
    throw new Error(message || 'Project submission failed');
  }

  return isJson ? response.json() : response.text();
}
