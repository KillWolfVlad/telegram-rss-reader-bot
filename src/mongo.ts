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

import { Collection, Db, MongoClient, ServerApiVersion } from "mongodb";

import { config } from "./config";
import { IRssItem } from "./fetchRss";

export const mongoClient = new MongoClient(config.databaseUrl, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

export const getDatabase = (): Db => {
  return mongoClient.db(`chat${config.chatId}`);
};

export const getMessagesCollection = (): Collection<IRssItem> => {
  return getDatabase().collection("messages");
};
