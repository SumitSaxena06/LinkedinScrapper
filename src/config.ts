import * as dotenv from "dotenv";
dotenv.config();

function requireEnv(key: string): string {
  const val = process.env[key];
  if (!val || val.includes("your_")) {
    throw new Error(
      `  Missing config: ${key}\n` +
        `   Open your .env file and fill in ${key}\n` +
        `   See .env.example for instructions.`
    );
  }
  return val;
}

export const config = {
  botToken: requireEnv("BOT_TOKEN"),
  chatId: requireEnv("CHAT_ID"),
  cronSchedule: process.env.CRON_SCHEDULE ?? "*/15 * * * *",
  maxJobAgeHours: Number(process.env.MAX_JOB_AGE_HOURS ?? 1),

  searches: [
    { keywords: "Frontend Intern",            location: "Noida" },
    { keywords: "Frontend Intern",            location: "Delhi" },
    { keywords: "Software Engineer junior",            location: "Gurgaon" },
    { keywords: "Frontend Intern",            location: "India" },
    
  ],
} as const;
