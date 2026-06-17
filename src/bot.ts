import { Telegraf } from "telegraf";
import { Job } from "./scraper";
import { config } from "./config";

const bot = new Telegraf(config.botToken);

export async function sendAlert(job: Job): Promise<void> {
  const sourceLabel = job.source === "linkedin" ? "LinkedIn" : job.source;
  const msg =
    ` *${escapeMarkdown(job.title)}*\n` +
    `${escapeMarkdown(job.company)}\n` +
    ` ${escapeMarkdown(job.location)}\n` +
    `[Apply on ${sourceLabel}](${job.link})`;

  await bot.telegram.sendMessage(config.chatId, msg, {
    parse_mode: "Markdown",
    link_preview_options: { is_disabled: true },
  });
}

export async function sendMessage(text: string): Promise<void> {
  await bot.telegram.sendMessage(config.chatId, text, {
    parse_mode: "Markdown",
  });
}

function escapeMarkdown(text: string): string {
  return text.replace(/[_*[\]()~`>#+\-=|{}.!]/g, "\\$&");
}

export { bot };
