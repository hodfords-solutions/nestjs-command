import { Injectable } from '@nestjs/common';
import lodash from 'lodash';
import { Command } from '../decorators/command.decorator.js';
import { BaseMakeCommand, resolveStub } from './base-make.command.js';

// `lodash` is CommonJS: named ESM imports are not detectable, so destructure the default export.
const { startCase } = lodash;

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
    public getStub(): string {
        return resolveStub('make-command.stub');
    }

    public handle(): void {
        const [command] = this.program.args;
        this.getContent();
        this.replaceContent([
            {
                search: '$$COMMAND$$',
                value: command
            },
            {
                search: '$$CLASS$$',
                value: startCase(command).replace(/ /g, '')
            }
        ]);
        this.writeFileToModule('console/commands', `${command}.command.ts`);
        this.success(`Create command ${command} successfully!`);
    }
}
