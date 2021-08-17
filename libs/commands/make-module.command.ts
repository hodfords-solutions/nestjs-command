import { Injectable } from '@nestjs/common';
import { BaseMakeCommand } from './base-make-command';
import { Command } from '../decorators/command.decorator';
import { MakeE2eTestCommand } from './make-e2e-test.command';
import { MakeServiceCommand } from './make-service.command';
import { MakeControllerCommand } from './make-controller.command';
import { MakeEntityCommand } from './make-entity.command';
import { MakeRepositoryCommand } from './make-repository.command';
import { MakeDtoCommand } from './make-dto.command';
import { resolve } from 'path';

@Command({
    signature: 'make-module <name>',
    description: 'Make a migration'
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
        return resolve(__dirname, '../stubs/make-migration.stub');
    }

    public handle() {
        let [name] = this.args;
        let options = { module: name };
        this.makeTestCommand.runWith([`${name}.controller`], options);
        this.makeServiceCommand.runWith([name], options);
        this.makeControllerCommand.runWith([name], options);
        this.makeEntityCommand.runWith([name], options);
        this.makeRepositoryCommand.runWith([name], options);
        this.makeDtoCommand.runWith([`create-${name}`], options);
    }
}
