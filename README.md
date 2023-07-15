# telegram-rss-reader-bot

[![test](https://github.com/KillWolfVlad/telegram-rss-reader-bot/actions/workflows/test.yaml/badge.svg?branch=master)](https://github.com/KillWolfVlad/telegram-rss-reader-bot/actions/workflows/test.yaml)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://github.com/prettier/prettier)

Telegram RSS Reader Bot

## Requirements

- Node.js v18 LTS or later
- Yarn
- MongoDB

## Configuration

Bot can be configured via env variables or `.env` file (only for development).

See [.env.example](./.env.example) for more information about envs.

## Endpoints

- Execute bot once

```http
POST /webhooks/{secret}
```

- Health Check

```http
GET /_healthz
```

## Deploy

We recommend use[^1]:

- <https://adaptable.io> for bot hosting
- <https://www.mongodb.com> as MongoDB provider
- GitHub Actions for triggering bot

[^1]: You can use this services absolutely free without credit card

## Maintainers

- [@KillWolfVlad](https://github.com/KillWolfVlad)

## License

This repository is released under version 2.0 of the
[Apache License](https://www.apache.org/licenses/LICENSE-2.0).
