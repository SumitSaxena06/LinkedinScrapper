import { scrapeAllJobs } from "./scraper";
import { sendAlert } from "./bot";

async function main() {
  const jobs = await scrapeAllJobs();

  console.log(`Found ${jobs.length} jobs`);

  const firstFive = jobs.slice(0, 5);

  for (const job of firstFive) {
    await sendAlert(job);
    console.log(`Sent: ${job.title}`);
  }

  console.log("Done");
}

main().catch(console.error);