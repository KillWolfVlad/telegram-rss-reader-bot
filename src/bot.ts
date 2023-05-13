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

import fs from "fs";

import { get as getEmoji } from "node-emoji";
import { Telegraf } from "telegraf";
import { code, fmt, link } from "telegraf/format";

import { config } from "./config";

const pjson = JSON.parse(
  // eslint-disable-next-line n/no-sync
  fs.readFileSync(process.env.npm_package_json as string, "utf8"),
) as {
  readonly homepage: string;
};

export const bot = new Telegraf(config.botToken);

bot.start(async (context) => {
  const chatId = context.message.chat.id;

  const formattedChatId = code`${chatId}`;

  const header = fmt`${getEmoji("wave")} Your Chat ID: ${formattedChatId}`;

  const source = link("source", pjson.homepage);

  const deployInfo = fmt`${getEmoji(
    "information_source",
  )} But you can deploy your own bot from ${source}.`;

  const footer =
    String(chatId) === config.chatId
      ? fmt`${getEmoji("bow")} I am glad to serve you my master!`
      : fmt`${getEmoji(
          "no_entry",
        )} You are not authorized to use this bot!\n\n${deployInfo}`;

  const message = fmt`${header}\n\n${footer}`;

  await context.reply(message);
});
