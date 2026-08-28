import { DynamicModule, Module, Provider } from '@nestjs/common';
import { CommandService } from './command.service.js';
import { MakeCommandCommand } from './commands/make-command.command.js';
import { MakeControllerCommand } from './commands/make-controller.command.js';
import { MakeDtoCommand } from './commands/make-dto.command.js';
import { MakeE2eTestCommand } from './commands/make-e2e-test.command.js';
import { MakeEntityCommand } from './commands/make-entity.command.js';
import { MakeMigrationCommand } from './commands/make-migration.command.js';
import { MakeModuleCommand } from './commands/make-module.command.js';
import { MakeRepositoryCommand } from './commands/make-repository.command.js';
import { MakeServiceCommand } from './commands/make-service.command.js';
import { ListCronJobsCommand } from './commands/list-cron-jobs.command.js';
import { RunCronJobsCommand } from './commands/run-cron-jobs.command.js';

@Module({})
export class CommandModule {
    static register(isEnableTypeorm = true, isEnableCronJob = true): DynamicModule {
        const providers: Provider[] = [
            CommandService,
            MakeCommandCommand,
            MakeE2eTestCommand,
            MakeModuleCommand,
            MakeServiceCommand,
            MakeEntityCommand,
            MakeControllerCommand,
            MakeDtoCommand,
            MakeRepositoryCommand
        ];
        if (isEnableTypeorm) {
            providers.push(MakeMigrationCommand);
        }
        if (isEnableCronJob) {
            providers.push(ListCronJobsCommand, RunCronJobsCommand);
        }
        return {
            module: CommandModule,
            providers,
            exports: [CommandService],
            imports: []
        };
    }
}
