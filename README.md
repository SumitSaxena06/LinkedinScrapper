# Job Alert Agent

Gets notified on Telegram the moment a matching job is posted on LinkedIn.

## Stack
- **Node.js** + **TypeScript**
- **Axios** + **Cheerio** — scraping
- **node-cron** — scheduling
- **Prisma** + **SQLite** (or PostgreSQL) — deduplication
- **Telegraf** — Telegram bot

---

## Setup

### 1. Install dependencies
```bash
npm install
```

### 2. Create your Telegram bot
1. Open Telegram → search **@BotFather** → send `/newbot`
2. Follow prompts → copy your **bot token**
3. Start a chat with your new bot (click the link BotFather gives you → Start)
4. Visit this URL in your browser (replace YOUR_TOKEN):
   ```
   https://api.telegram.org/botYOUR_TOKEN/getUpdates
   ```
5. Send any message to your bot, refresh the URL above
6. Find `"chat": { "id": 123456789 }` — that number is your **chat ID**

### 3. Configure your .env
```bash
cp .env.example .env
```
Open `.env` and fill in:
- `BOT_TOKEN` — from step 2
- `CHAT_ID` — from step 2

### 4. Set up the database
```bash
npm run db:generate
npm run db:migrate
```
This creates `jobs.db` (SQLite file) in the project root.

### 5. Customize your job searches
Open `src/config.ts` and edit the `searches` array:
```ts
searches: [
  { keywords: "SDE 1 Node.js",  location: "Bengaluru" },
  { keywords: "Backend React",   location: "Noida" },
  // add more...
]
```

---

## Testing

### Test your Telegram bot (no scraping)
```bash
npm run test:bot
```
You should receive a test message + sample job alert on Telegram.

### Test the scraper (no Telegram)
```bash
npm run test:scraper
```
Prints found jobs to the terminal. If 0 results, try setting `MAX_JOB_AGE_HOURS=24` in `.env`.

---

## Run

### Development (with live TypeScript)
```bash
npm run dev
```

### Production
```bash
npm run build
npm start
```

### Keep it running (Linux / WSL)
```bash
# Using nohup
nohup npm run dev > agent.log 2>&1 &

# Check logs
tail -f agent.log

# Stop it
kill $(lsof -t -i:0 -c node)
```

### Keep it running (PM2 — recommended)
```bash
npm install -g pm2
pm2 start "npm run dev" --name job-alert-agent
pm2 save
pm2 logs job-alert-agent
```

---

## Database viewer
```bash
npm run db:studio
```
Opens Prisma Studio at http://localhost:5555 — browse all seen jobs.

---

## Switching to PostgreSQL
1. Edit `prisma/schema.prisma`:
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```
2. Update `.env`:
   ```
   DATABASE_URL="postgresql://user:pass@localhost:5432/jobalerts"
   ```
3. Re-run migrations:
   ```bash
   npm run db:migrate
   ```

---

## Troubleshooting

| Problem | Fix |
|---|---|
| `Missing config: BOT_TOKEN` | Fill in `.env` file |
| `0 jobs found` | Set `MAX_JOB_AGE_HOURS=24`, or LinkedIn may be rate-limiting — wait 10 min |
| Telegram `Forbidden` error | Make sure you started a chat with your bot first |
| `Cannot find module` errors | Run `npm install` and `npm run db:generate` |
