/**
 * Run with:  npm run test:bot
 *
 * Sends a test message to your Telegram chat to verify
 * BOT_TOKEN and CHAT_ID are configured correctly.
 */
import { sendMessage, sendAlert } from "./bot";

const SAMPLE_JOB = {
  id:       "test-123",
  title:    "SDE 1 — Node.js & TypeScript",
  company:  "Test Company Pvt. Ltd.",
  location: "Bengaluru, Karnataka",
  link:     "https://www.linkedin.com/jobs/view/test-123",
  source:   "linkedin",
};

(async () => {
  console.log(" Sending test message to Telegram...");

  try {
    await sendMessage(" *Bot connection test passed!*\nYour job alert agent is connected.");
    console.log("  ✓ Plain message sent");

    await sendAlert(SAMPLE_JOB);
    console.log("  ✓ Sample job alert sent");

    console.log("\n All good! Check your Telegram.");
  } catch (err) {
    console.error("\n Telegram test failed:", (err as Error).message);
    console.error("   → Check BOT_TOKEN and CHAT_ID in your .env file");
    process.exit(1);
  }
})();
