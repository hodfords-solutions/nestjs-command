<p align="center">
  <a href="http://opensource.hodfords.uk" target="blank"><img src="https://opensource.hodfords.uk/img/logo.svg" width="320" alt="Hodfords Logo" /></a>
</p>

<p align="center"> <b>nestjs-command</b> simplifies creating and managing CLI commands in NestJS applications. It offers an easy way to define and execute commands, streamlining CLI integration and boosting productivity with minimal configuration.</p>

## Requirements 📋

-   This package is **ESM-only**. Your project must be able to `import` it — CommonJS `require()` of it is not supported.
-   Node.js `>= 20.19.0` (or `>= 22.12`, `>= 24.15`, `>= 26`).
-   NestJS 12.

| `@hodfords/nestjs-command` | NestJS |
| -------------------------- | ------ |
| `12.x`                     | `12.x` |
| `11.x`                     | `11.x` |

## Installation 🤖

Install the `nestjs-command` package with:

```
npm install @hodfords/nestjs-command --save
```

Set up in your codebase:

-   `src/config/command.config.ts`

```typescript
import { CommandModule } from '@hodfords/nestjs-command';

export const commandConfig = CommandModule.register();

// export const = CommandModule.register(false) if typeorm is disabled
```

-   `src/app.module.ts`

```typescript
import { Module } from '@nestjs/common';
import { commandConfig } from '~config/command.config';

@Module({
    imports: [commandConfig],
    controllers: [],
    providers: []
})
export class AppModule {}
```

-   `src/cli.ts`

```typescript
import { NestFactory } from '@nestjs/core';
import { CommandService } from '@hodfords/nestjs-command';
import { commandConfig } from '~config/command.config';

async function bootstrap() {
    const app = await NestFactory.createApplicationContext(AppModule);
    const commandService: CommandService = app.select(commandConfig).get(CommandService, { strict: true });
    await commandService.exec();
    await app.close();
}

bootstrap();
```

-   `package.json`

```json
"wz-command": "wz-command"
```

The entry file is resolved from `CLI_PATH` (default `./src/cli.ts`), relative to the directory you run the command from. When the entry is a TypeScript file, install `ts-node`, `tsx` or `@swc-node/register` in your application: it is registered as an ESM loader for projects with `"type": "module"`, and through `ts-node/register` plus `tsconfig-paths` for CommonJS projects.

## Usage 🚀

Here’s how you can use them. For each type of component, you can use one of the two available command formats: with `npm run` or directly with `wz-command`

### Make a command

```bash
npm run wz-command make-command <file-name> -- --module <module-name>
```

```bash
wz-command make-command <file-name> --module <module-name>
```

### Make a controller

```bash
npm run wz-command make-controller <file-name> -- --module <module-name>
```

```bash
wz-command make-controller <file-name> --module <module-name>
```

### Make a dto

```bash
npm run wz-command make-dto <file-name> -- --module <module-name>
```

```bash
wz-command make-dto <file-name> --module <module-name>
```

### Make an e2e test

```bash
npm run wz-command make-e2e-test <file-name> -- --module <module-name>
```

```bash
wz-command make-e2e-test <file-name> --module <module-name>
```

### Make an entity

```bash
npm run wz-command make-entity <file-name> -- --module <module-name>
```

```bash
wz-command make-entity <file-name> --module <module-name>
```

### Make a migration

#### Create table

```bash
npm run wz-command make-migration <file-name> -- --module <module-name> --create=<entity-name>
```

```bash
wz-command make-migration <file-name> --module <module-name> --create=<entity-name>
```

#### Update table

```bash
npm run wz-command make-migration <file-name> -- --module <module-name> --update=<entity-name>
```

```bash
wz-command make-migration <file-name> --module <module-name> --update=<entity-name>
```

### Make a module

```bash
npm run wz-command make-module <module-name>
```

```bash
wz-command make-module <file-name>
```

### Make a repository

```bash
npm run wz-command make-repository <file-name> -- --module <module-name>
```

```bash
wz-command make-repository <file-name> --module <module-name>
```

### Make a service

```bash
npm run wz-command make-service <file-name> -- --module <module-name>
```

```bash
wz-command make-service <file-name> --module <module-name>
```

### List all scheduled cron jobs

```bash
npm run wz-command list-cron-jobs
```

```bash
wz-command list-cron-jobs
```

### Run specific cron jobs

```bash
npm run wz-command run-cron-jobs -- --jobs <jobName>
```

```bash
wz-command run-cron-jobs --jobs <jobName>
```

## License 📝

This project is licensed under the MIT License
