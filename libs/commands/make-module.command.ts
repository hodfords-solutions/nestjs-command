import { Injectable } from '@nestjs/common';
import { resolve } from 'path';
import pluralize from 'pluralize';
import { Command } from '../decorators/command.decorator';
import { BaseMakeCommand } from './base-make.command';
import { MakeControllerCommand } from './make-controller.command';
import { MakeDtoCommand } from './make-dto.command';
import { MakeE2eTestCommand } from './make-e2e-test.command';
import { MakeEntityCommand } from './make-entity.command';
import { MakeRepositoryCommand } from './make-repository.command';
import { MakeServiceCommand } from './make-service.command';

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

    public getStub() {
        return resolve(__dirname, '../stubs/modules/module.stub');
    }

    get moduleName() {
        return pluralize(this.args[0]);
    }

    public handle() {
        let [name] = this.args;
        let options = { module: this.moduleName };
        this.makeTestCommand.runWith([`${name}.controller`], options);
        this.makeServiceCommand.runWith([name], options);
        this.makeControllerCommand.runWith([name], options);
        this.makeEntityCommand.runWith([name], options);
        this.makeRepositoryCommand.runWith([name], options);
        this.makeDtoCommand.runWith([`create-${name}`], options);

        this.createModuleFile();
    }

    private createModuleFile() {
        let [name] = this.args;
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
