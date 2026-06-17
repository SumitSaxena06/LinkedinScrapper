
import { scrapeAllJobs } from "./scraper";

(async () => {
  console.log(" Running scraper test...\n");

  try {
    const jobs = await scrapeAllJobs();

    if (jobs.length === 0) {
      console.log("  No jobs found.");
      console.log("   This can happen if:");
      console.log("   1. LinkedIn is blocking the request (try again in a few minutes)");
      console.log("   2. No jobs posted in the last 1 hour for your keywords");
      console.log("   3. Try changing MAX_JOB_AGE_HOURS=24 in .env to widen the window");
    } else {
      console.log(` Found ${jobs.length} job(s):\n`);
      jobs.forEach((job, i) => {
        console.log(`${i + 1}. ${job.title}`);
        console.log(`   Company:  ${job.company}`);
        console.log(`   Location: ${job.location}`);
        console.log(`   Link:     ${job.link}`);
        console.log(`   ID:       ${job.id}`);
        console.log("");
      });
    }
  } catch (err) {
    console.error(" Scraper test failed:", (err as Error).message);
    process.exit(1);
  }
})();
