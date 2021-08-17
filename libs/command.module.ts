import { Module } from '@nestjs/common';
import { CommandService } from './command.service';
import { MakeCommandCommand } from './commands/make-command.command';
import { MakeMigrationCommand } from './commands/make-migration.command';
import { MakeModuleCommand } from './commands/make-module.command';
import { MakeE2eTestCommand } from './commands/make-e2e-test.command';
import { MakeServiceCommand } from './commands/make-service.command';
import { MakeEntityCommand } from './commands/make-entity.command';
import { MakeControllerCommand } from './commands/make-controller.command';
import { MakeDtoCommand } from './commands/make-dto.command';
import { MakeRepositoryCommand } from './commands/make-repository.command';

@Module({
    providers: [
        CommandService,
        MakeCommandCommand,
        MakeMigrationCommand,
        MakeE2eTestCommand,
        MakeModuleCommand,
        MakeServiceCommand,
        MakeEntityCommand,
        MakeControllerCommand,
        MakeDtoCommand,
        MakeRepositoryCommand
    ],
    exports: [CommandService],
    imports: []
})
export class CommandModule {}
