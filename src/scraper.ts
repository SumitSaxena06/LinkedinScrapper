import axios, { AxiosError } from "axios";
import * as cheerio from "cheerio";
import { config } from "./config";

export interface Job {
  id:       string;
  title:    string;
  company:  string;
  location: string;
  link:     string;
  source:   string;
}

const HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) " +
    "AppleWebKit/537.36 (KHTML, like Gecko) " +
    "Chrome/124.0.0.0 Safari/537.36",
  "Accept-Language": "en-US,en;q=0.9",
};

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

async function fetchWithRetry(url: string, retries = 3): Promise<string> {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const { data } = await axios.get<string>(url, {
        headers: HEADERS,
        timeout: 15_000,
      });
      return data;
    } catch (err) {
      const status = (err as AxiosError)?.response?.status;
      console.warn(`  [scraper] Attempt ${attempt} failed (HTTP ${status ?? "network error"})`);
      if (attempt < retries) await sleep(attempt * 2000);
    }
  }
  throw new Error(`Failed to fetch after ${retries} attempts: ${url}`);
}

async function scrapeLinkedIn(keywords: string, location: string): Promise<Job[]> {
  const ageFilter = `r${config.maxJobAgeHours * 3600}`; 
  const url =
    `https://www.linkedin.com/jobs/search/` +
    `?keywords=${encodeURIComponent(keywords)}` +
    `&location=${encodeURIComponent(location)}` +
    `&f_TPR=${ageFilter}` +
    `&sortBy=DD`;

  const html = await fetchWithRetry(url);
  const $    = cheerio.load(html);
  const jobs: Job[] = [];

  $("div.base-card").each((_, el) => {
    try {
      const title   = $(el).find("h3.base-search-card__title").text().trim();
      const company = $(el).find("h4.base-search-card__subtitle").text().trim();
      const loc     = $(el).find("span.job-search-card__location").text().trim();
      const href    = $(el).find("a.base-card__full-link").attr("href") ?? "";
      const link    = href.split("?")[0];
      const id      = link.trimEnd().split("-").at(-1) ?? "";

      if (id && title && link) {
        jobs.push({ id, title, company, location: loc, link, source: "linkedin" });
      }
    } catch {
      // malformed card — skip silently
    }
  });

  return jobs;
}

export async function scrapeAllJobs(): Promise<Job[]> {
  const allJobs: Job[] = [];

  for (const query of config.searches) {
    console.log(`  [scraper] "${query.keywords}" in ${query.location}`);
    try {
      const jobs = await scrapeLinkedIn(query.keywords, query.location);
      console.log(`           → ${jobs.length} listings found`);
      allJobs.push(...jobs);
    } catch (err) {
      console.error(`  [scraper] ✗ Failed for "${query.keywords}":`, (err as Error).message);
    }
    await sleep(1500);
  }

  const seen = new Set<string>();
  return allJobs.filter((j) => {
    if (seen.has(j.id)) return false;
    seen.add(j.id);
    return true;
  });
}
