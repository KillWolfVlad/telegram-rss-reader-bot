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

import dayjs from "dayjs";

import { bot } from "./bot";
import { config } from "./config";
import { IRssItem } from "./fetchRss";
import { formatMessage } from "./formatMessage";
import { logger } from "./logger";
import { getMessagesCollection } from "./mongo";

export const sendMessage = async (item: IRssItem): Promise<void> => {
  const messages = getMessagesCollection();

  const sendedMessage = await messages.findOne({
    publicationDate: item.publicationDate,
    title: item.title,
  });

  if (sendedMessage) {
    logger.debug("message '%s' already sended", item.title);
    return;
  }

  const message = formatMessage(item);

  const currentHour = dayjs().tz(config.botTimeZone).hour();

  const disableNotification =
    currentHour < config.doNotDisturbUntil ||
    currentHour >= config.doNotDisturbAfter;

  await bot.telegram.sendMessage(config.chatId, message, {
    disable_notification: disableNotification,
  });

  logger.debug("send message '%s'", item.title);

  await messages.insertOne(item);

  logger.debug("insert message into db '%s'", item.title);
};
