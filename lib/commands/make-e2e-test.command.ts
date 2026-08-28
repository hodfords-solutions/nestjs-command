import { Injectable } from '@nestjs/common';
import { Command } from '../decorators/command.decorator.js';
import { BaseMakeCommand, resolveStub } from './base-make.command.js';

@Command({
    signature: 'make-e2e-test <name>',
    description: 'Make an e2e test',
    options: [
        {
            value: '--module <module>',
            description: 'Module'
        }
    ]
})
@Injectable()
export class MakeE2eTestCommand extends BaseMakeCommand {
    public getStub(): string {
        return resolveStub('modules/tests/e2e-spec.stub');
    }

    public handle(): void {
        const [name] = this.args;
        this.getContent();
        this.replaceContent([
            {
                search: '$$CLASS$$',
                value: this.getClassName(name)
            }
        ]);
        this.writeFileToModule('tests', `${name}.e2e-spec.ts`);
        this.success(`Create test ${name} successfully!`);
    }
}
