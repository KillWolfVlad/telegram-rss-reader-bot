/*
 * Copyright 2023 KillWolfVlad
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { LogLevel } from "@byndyusoft/pino-logger-factory";

export const config = {
  botToken: process.env.BOT_TOKEN as string,

  botLocale: process.env.BOT_LOCALE as string,

  botTimeZone: process.env.BOT_TIMEZONE as string,

  rssUrl: process.env.RSS_URL as string,

  chatId: process.env.CHAT_ID as string,

  warningKeywords: (process.env.WARNING_KEYWORDS as string)
    .split(",")
    .map((x) => x.toLowerCase()),

  doNotDisturbUntil: Number(process.env.DO_NOT_DISTURB_UNTIL as string),

  doNotDisturbAfter: Number(process.env.DO_NOT_DISTURB_AFTER as string),

  webhookSecret: process.env.WEBHOOK_SECRET as string,

  databaseUrl: process.env.DATABASE_URL as string,

  port: Number(process.env.PORT ?? "8080"),

  host: process.env.HOST ?? "::",

  logger: {
    level: (process.env.LOGGER_LEVEL ?? "info") as LogLevel,
    pretty: (process.env.LOGGER_PRETTY ?? "false") === "true",
  },
};
