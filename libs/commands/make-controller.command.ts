import { Injectable } from '@nestjs/common';
import { resolve } from 'path';
import { Command } from '../decorators/command.decorator';
import { BaseMakeCommand } from './base-make.command';

@Command({
    signature: 'make-controller <name>',
    description: 'Make a controller',
    options: [
        {
            value: '--module <module>',
            description: 'Module'
        }
    ]
})
@Injectable()
export class MakeControllerCommand extends BaseMakeCommand {
    public getStub() {
        return resolve(__dirname, '../stubs/modules/http/controllers/controller.stub');
    }

    public handle() {
        let [name] = this.args;
        this.getContent();
        this.replaceContent([
            {
                search: '$$CLASS$$',
                value: this.getClassName(name)
            },
            {
                search: '$$PROPERTY$$',
                value: this.getPropertyName(name)
            },
            {
                search: '$$FILENAME$$',
                value: this.getFileName(name)
            },
            {
                search: '$$TITLE$$',
                value: this.getTitleName(name)
            }
        ]);
        this.writeFileToModule('http/controllers', `${name}.controller.ts`);
        this.success(`Create controller ${name} successfully!`);
    }
}
