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
- `src/config/command.config.ts`
```javascript
import { CommandModule } from '@hodfords/nestjs-command';

export const commandConfig = CommandModule.register(); // CommandModule.register(false) if typeorm is disabled
```

- `src/app.module.ts`
```javascript
import { Module } from '@nestjs/common';
import { CommandModule } from '@hodfords/nestjs-command';

@Module({
    imports: [commandConfig],
    controllers: [],
    providers: []
})
export class AppModule {}
```

- `src/cli.ts`

```javascript
import { NestFactory } from '@nestjs/core';
import { CommandService } from '@hodfords/nestjs-command';
import { commandConfig } from '~config/command.config';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    const commandService: CommandService = app.select(commandConfig).get(CommandService, { strict: true });
    await commandService.exec();
    await app.close();
}

bootstrap();
```

- `package.json`

```json
"wz-command": "wz-command"
```

## Usage ⚡️

### Make new command

```bash
npm run wz-command make-command <file-name> -- --module <module-name>
OR
wz-command make-command <file-name> --module <module-name>
```

### Make controller

```bash
npm run wz-command make-controller <file-name> -- --module <module-name>
OR
wz-command make-controller <file-name> --module <module-name>
```

### Make dto

```bash
npm run wz-command make-dto <file-name> -- --module <module-name>
OR
wz-command make-dto <file-name> --module <module-name>
```

### Make e2e test

```bash
npm run wz-command make-e2e-test <file-name> -- --module <module-name>
OR
wz-command make-e2e-test <file-name> --module <module-name>
```

### Make entity

```bash
npm run wz-command make-entity <file-name> -- --module <module-name>
OR
wz-command make-entity <file-name> --module <module-name>
```

### Make migration
#### Create new table
```bash
npm run wz-command make-migration <file-name> -- --module <module-name> --create=<entity-name>
OR
wz-command make-migration <file-name> --module <module-name> --create=<entity-name>
```
#### Update a table
```bash
npm run wz-command make-migration <file-name> -- --module <module-name> --update=<entity-name>
OR
wz-command make-migration <file-name> --module <module-name> --update=<entity-name>
```

### Make module

```bash
npm run wz-command make-module <module-name>
OR
wz-command make-module <file-name>
```

### Make repository

```bash
npm run wz-command make-repository <file-name> -- --module <module-name>
OR
wz-command make-repository <file-name> --module <module-name>
```

### Make service

```bash
npm run wz-command make-service <file-name> -- --module <module-name>
OR
wz-command make-service <file-name> --module <module-name>
```
