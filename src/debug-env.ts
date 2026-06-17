import * as dotenv from "dotenv";

const result = dotenv.config();

console.log("dotenv result:", result);
console.log("BOT_TOKEN =", process.env.BOT_TOKEN);
console.log("CHAT_ID =", process.env.CHAT_ID);