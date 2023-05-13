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

import axios from "axios";
import contentType from "content-type";
import iconv from "iconv-lite";
import _ from "lodash";
import Parser from "rss-parser";

import { config } from "./config";

const parser = new Parser();

export interface IRssItem {
  readonly publicationDate: Date;
  readonly title: string;
  readonly content: string;
  readonly link: string;
}

const normalizeContent = (content: string): string => {
  return content
    .replaceAll("\r\n", "\n")
    .replaceAll(/\n\s+\n/g, "\n\n")
    .split("\n")
    .map((x) => _.trim(x, " "))
    .join("\n");
};

export const fetchRss = async (): Promise<IRssItem[]> => {
  const response = await axios.get(config.rssUrl, {
    responseType: "arraybuffer",
  });

  const {
    parameters: { charset },
  } = contentType.parse(response.headers["content-type"] as string);

  const xml = iconv.decode(response.data as Buffer, charset);

  const feed = await parser.parseString(xml);

  return feed.items.reverse().map((x) => ({
    publicationDate: new Date(x.isoDate as string),
    title: x.title as string,
    content: normalizeContent(x.contentSnippet as string),
    link: x.link as string,
  }));
};
