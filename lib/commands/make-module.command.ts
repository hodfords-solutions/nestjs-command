import { Injectable } from '@nestjs/common';
import pluralize from 'pluralize';
import { Command } from '../decorators/command.decorator.js';
import { BaseMakeCommand, resolveStub } from './base-make.command.js';
import { MakeControllerCommand } from './make-controller.command.js';
import { MakeDtoCommand } from './make-dto.command.js';
import { MakeE2eTestCommand } from './make-e2e-test.command.js';
import { MakeEntityCommand } from './make-entity.command.js';
import { MakeRepositoryCommand } from './make-repository.command.js';
import { MakeServiceCommand } from './make-service.command.js';

@Command({
    signature: 'make-module <name>',
    description: 'Make a new module'
})
@Injectable()
export class MakeModuleCommand extends BaseMakeCommand {
    constructor(
        private makeTestCommand: MakeE2eTestCommand,
        private makeServiceCommand: MakeServiceCommand,
        private makeControllerCommand: MakeControllerCommand,
        private makeEntityCommand: MakeEntityCommand,
        private makeRepositoryCommand: MakeRepositoryCommand,
        private makeDtoCommand: MakeDtoCommand
    ) {
        super();
    }

    public getStub(): string {
        return resolveStub('modules/module.stub');
    }

    get moduleName(): string {
        return pluralize(this.args[0]);
    }

    public handle(): void {
        const [name] = this.args;
        const options = { module: this.moduleName };
        this.makeTestCommand.runWith([`${name}.controller`], options);
        this.makeServiceCommand.runWith([name], options);
        this.makeControllerCommand.runWith([name], options);
        this.makeEntityCommand.runWith([name], options);
        this.makeRepositoryCommand.runWith([name], options);
        this.makeDtoCommand.runWith([`create-${name}`], options);

        this.createModuleFile();
    }

    private createModuleFile(): void {
        const [name] = this.args;
        this.getContent();
        this.replaceContent([
            {
                search: '$$CLASS$$',
                value: this.getClassName(name)
            },
            {
                search: '$$CONTROLLER_NAME$$',
                value: this.moduleName
            },
            {
                search: '$$FILENAME$$',
                value: this.getFileName(name)
            }
        ]);

        this.writeFileToModule(this.moduleName, `${name}.module.ts`);
        this.success(`Create ${this.moduleName} successfully!`);
    }
}
