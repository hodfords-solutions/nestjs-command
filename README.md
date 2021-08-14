<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo_text.svg" width="320" alt="Nest Logo" /></a>
</p>

# nestjs-command

## Description

[Nest](https://github.com/nestjs/nest) Nest commands for common templates

___

- [Installation](#installation)
- [Usage](#usage)
  - [Make new command](#make-new-command)
  - [Make controller](#make-controller)
  - [Make DTO](#make-dto)
  - [Make e2e test](#make-e2e-test)
  - [Make entity](#make-entity)
  - [Make migration](#make-migration)
  - [Make module](#make-module)
  - [Make repository](#make-repository)
  - [Make service](#make-service)

## Installation 🤖

```
npm install @hodfords/nestjs-command --save-dev
```

- `src/app.module.ts`
```javascript
import { Module } from '@nestjs/common';
import { CommandModule } from '@hodfords/nestjs-command';

@Module({
    imports: [CommandModule],
    controllers: [],
    providers: []
})
export class AppModule {}
```

- `src/cli.ts`

```javascript
import { NestFactory } from '@nestjs/core';
import { CommandService, CommandModule } from '@hodfords/nestjs-command';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    const commandService: CommandService = app.select(CommandModule).get(CommandService, { strict: true });
    await commandService.exec();
    await app.close();
}

bootstrap();
```

- `package.json`

```json
"wz-command": "ts-node -r tsconfig-paths/register src/cli.ts"
```

## Usage ⚡️

### Make new command

```bash
wz-command make-command <file-name> --module <module-name>
```

### Make controller

```bash
wz-command make-controller <file-name> --module <module-name>
```

### Make dto

```bash
wz-command make-dto <file-name> --module <module-name>
```

### Make e2e test

```bash
wz-command make-e2e-test <file-name> --module <module-name>
```

### Make entity

```bash
wz-command make-entity <file-name> --module <module-name>
```

### Make migration

```bash
wz-command make-migration <file-name> --module <module-name>
```

### Make module

```bash
wz-command make-module <file-name> --module <module-name>
```

### Make repository

```bash
wz-command make-repository <file-name> --module <module-name>
```

### Make service

```bash
wz-command make-service <file-name> --module <module-name>
```
