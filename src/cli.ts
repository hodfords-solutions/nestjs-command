import { NestFactory } from '@nestjs/core';
import { CommandService } from '@hodfords/nestjs-command';
import { commandConfig } from 'src/config/command.config';
import { AppModule } from 'src/app.module';

async function bootstrap() {
    const app = await NestFactory.createApplicationContext(AppModule);
    const commandService: CommandService = app.select(commandConfig).get(CommandService, { strict: true });
    await commandService.exec();
    await app.close();
}

bootstrap();