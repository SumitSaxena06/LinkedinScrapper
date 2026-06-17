import cron from "node-cron";
import { scrapeAllJobs } from "./scraper";
import { isSeen, markSeen, getStats, disconnect } from "./db";
import { sendAlert, sendMessage } from "./bot";
import { config } from "./config";

async function runAgent(): Promise<void> {
  const timestamp = new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });
  console.log(`\n[${timestamp}] Checking for new jobs...`);

  try {
    const jobs = await scrapeAllJobs();
    console.log(`  Found ${jobs.length} total listings across all searches`);

    let newCount = 0;
    for (const job of jobs) {
      if (await isSeen(job.id)) continue;

      await sendAlert(job);
      await markSeen(job);
      newCount++;
      console.log(`Sent: ${job.title} @ ${job.company}`);

      await sleep(1500);
    }

    if (newCount === 0) {
      console.log("  No new jobs found this run.");
    } else {
      console.log(`Sent ${newCount} new job alert(s).`);
    }
  } catch (err) {
    console.error(" Agent run failed:", (err as Error).message);
  }
}

async function sendStartupMessage(): Promise<void> {
  const searches = config.searches
    .map((s) => `• ${s.keywords} — ${s.location}`)
    .join("\n");

  await sendMessage(
    ` *Job Alert Agent started!*\n\n` +
    `Monitoring:\n${searches}\n\n` +
    ` Checking every: \`${config.cronSchedule}\``
  );
}

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

async function shutdown(signal: string) {
  console.log(`\n[agent] ${signal} received — shutting down...`);
  const stats = await getStats();
  console.log(`[agent] Total jobs tracked: ${stats.total}`);
  await disconnect();
  process.exit(0);
}

process.on("SIGINT",  () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));

(async () => {
  console.log(" Job Alert Agent starting...");
  console.log(`   Cron: ${config.cronSchedule}`);
  console.log(`   Searches: ${config.searches.length} queries configured`);
  console.log("");

  await sendStartupMessage();

  await runAgent();

  cron.schedule(config.cronSchedule, runAgent);
  console.log(`\n[agent] Scheduled. Running on: ${config.cronSchedule}`);
  console.log("[agent] Press Ctrl+C to stop.\n");
})();
