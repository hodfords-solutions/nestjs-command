import { DynamicModule, Module, Provider } from '@nestjs/common';
import { CommandService } from './command.service';
import { MakeCommandCommand } from './commands/make-command.command';
import { MakeControllerCommand } from './commands/make-controller.command';
import { MakeDtoCommand } from './commands/make-dto.command';
import { MakeE2eTestCommand } from './commands/make-e2e-test.command';
import { MakeEntityCommand } from './commands/make-entity.command';
import { MakeMigrationCommand } from './commands/make-migration.command';
import { MakeModuleCommand } from './commands/make-module.command';
import { MakeRepositoryCommand } from './commands/make-repository.command';
import { MakeServiceCommand } from './commands/make-service.command';

@Module({})
export class CommandModule {
    static register(isEnableTypeorm = true): DynamicModule {
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
        return {
            module: CommandModule,
            providers,
            exports: [CommandService],
            imports: []
        };
    }
}
