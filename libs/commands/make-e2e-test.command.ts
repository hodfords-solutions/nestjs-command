import { Injectable } from '@nestjs/common';
import { BaseMakeCommand } from './base-make.command';
import { Command } from '../decorators/command.decorator';
import { resolve } from 'path';

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
    public getStub() {
        return resolve(__dirname, '../stubs/modules/tests/e2e-spec.stub');
    }

    public handle() {
        let [name] = this.args;
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
