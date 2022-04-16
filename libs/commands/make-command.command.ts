import { Injectable } from '@nestjs/common';
import { startCase } from 'lodash';
import { resolve } from 'path';
import { Command } from '../decorators/command.decorator';
import { BaseMakeCommand } from './base-make.command';

@Command({
    signature: 'make-command <command>',
    description: 'Make a command',
    options: [
        {
            value: '--module <module>',
            description: 'Module'
        }
    ],
    params: {
        command: 'BaseCommand name'
    }
})
@Injectable()
export class MakeCommandCommand extends BaseMakeCommand {
    public getStub() {
        return resolve(__dirname, '../stubs/make-command.stub');
    }

    public handle() {
        const [command] = this.program.args;
        this.getContent();
        this.replaceContent([
            {
                search: '$$COMMAND$$',
                value: command
            },
            {
                search: '$$CLASS$$',
                value: startCase(command)
            }
        ]);
        this.writeFileToModule('console/commands', `${command}.command.ts`);
        this.success(`Create command ${command} successfully!`);
    }
}
