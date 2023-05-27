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
import { get as getEmoji } from "node-emoji";
import { bold, fmt, FmtString } from "telegraf/format";

import { config } from "./config";
import { IRssItem } from "./fetchRss";

const warnings = `${Array.from({ length: 3 })
  .map(() => getEmoji("warning"))
  .join("")}\n\n`;

export interface IFormatMessageOptions {
  readonly style: "normal" | "warning";
}

export const formatMessage = (
  item: IRssItem,
  options: IFormatMessageOptions,
): FmtString => {
  const publicationDate = dayjs
    .utc(item.publicationDate)
    .tz(config.botTimeZone)
    .format(config.dateFormatTemplate);

  const header = bold`${
    options.style === "warning" ? warnings : ""
  }${publicationDate}\n${item.title}`;

  const footer = fmt`${item.link}`;

  return fmt`${header}\n\n${item.content}\n\n${footer}`;
};
