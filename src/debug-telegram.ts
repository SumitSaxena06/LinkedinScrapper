import TelegramBot from "node-telegram-bot-api";
import * as dotenv from "dotenv";

dotenv.config();

async function main() {
  const bot = new TelegramBot(
    process.env.BOT_TOKEN!,
    { polling: false }
  );

  const res = await bot.sendMessage(
    process.env.CHAT_ID!,
    "Telegram Working"
  );

  console.log(res.message_id);
}

main().catch(console.error);