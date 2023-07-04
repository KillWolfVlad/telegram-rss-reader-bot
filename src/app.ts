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

/* eslint-disable no-await-in-loop */

import express, { NextFunction, Request, Response } from "express";
import asyncHandler from "express-async-handler";
import helmet from "helmet";

import { config } from "./config";
import { fetchRss } from "./fetchRss";
import { httpLogger } from "./logger";
import { sendMessage } from "./sendMessage";

export const app = express();

app.use(helmet());
app.use(httpLogger);

app.get("/_healthz", (_request, response) => {
  response.sendStatus(200).end();
});

app.post(
  "/webhooks/:secret",
  asyncHandler(async (request, response) => {
    if (request.params.secret !== config.webhookSecret) {
      response.sendStatus(401).end();

      return;
    }

    let hasErrors = false;
    const items = await fetchRss();

    for (const item of items) {
      try {
        await sendMessage(item);
      } catch (error) {
        request.log.error(error);
        hasErrors = true;
      }
    }

    if (hasErrors) {
      response.status(500).json({
        code: "HAS_ERRORS",
        message: "has errors while sending messages",
      });
    } else {
      response.status(204);
    }

    response.send();
  }),
);

app.use(
  (
    error: unknown,
    request: Request,
    response: Response,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _next: NextFunction,
  ) => {
    request.log.error(error);

    response.sendStatus(500).end();
  },
);
