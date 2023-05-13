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

/* eslint-disable n/no-process-exit,unicorn/no-process-exit */

import "source-map-support/register";

import { Server } from "http";

import { app } from "./app";
import { bot } from "./bot";
import { config } from "./config";
import { initDayjs } from "./dayjs";
import { logger } from "./logger";
import { getDatabase, getMessagesCollection, mongoClient } from "./mongo";

let server: Server;

const startDatabase = async (): Promise<void> => {
  const linkIndexName = "link_1";

  await mongoClient.connect();

  const existingCollectionNames = await getDatabase()
    .listCollections()
    .map((x) => x.name)
    .toArray();

  const messages = getMessagesCollection();

  if (existingCollectionNames.includes(messages.collectionName)) {
    logger.debug("collection %s already exists", messages.collectionName);
  } else {
    await mongoClient
      .db(messages.dbName)
      .createCollection(messages.collectionName);

    logger.debug("create collection %s", messages.collectionName);
  }

  const linkIndexExists = await messages.indexExists(linkIndexName);

  if (linkIndexExists) {
    logger.debug("index for link already exists");
  } else {
    await messages.createIndex("link", {
      name: linkIndexName,
    });

    logger.debug("create index for link");
  }

  logger.info("db is ready");
};

const stopDatabase = (): void => {
  mongoClient
    .close()
    .then(() => {
      logger.info("db is stopped");
    })
    .catch((error) => {
      logger.error(error);
    });
};

const startBot = (): void => {
  bot.launch().catch((error) => {
    logger.error(error);
    process.exit(1);
  });

  logger.info("bot is ready");
};

const stopBot = (signal: string): void => {
  bot.stop(signal);

  logger.info("bot is stopped");
};

const startServer = (): void => {
  server = app.listen(config.port, config.host, () => {
    logger.info("server is ready");
  });
};

const stop = (signal: string): void => {
  stopServer();
  stopDatabase();
  stopBot(signal);
};

const stopServer = (): void => {
  server.close((error) => {
    if (error) {
      logger.error(error);
    } else {
      logger.info("server is stopped");
    }
  });
};

const bootstrap = async (): Promise<void> => {
  await initDayjs();

  startBot();
  await startDatabase();
  startServer();

  process.once("SIGINT", stop);
  process.once("SIGTERM", stop);
};

bootstrap().catch((error) => {
  logger.error(error);
  process.exit(1);
});
