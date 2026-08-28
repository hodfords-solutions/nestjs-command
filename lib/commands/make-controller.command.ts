import { Injectable } from '@nestjs/common';
import { Command } from '../decorators/command.decorator.js';
import { BaseMakeCommand, resolveStub } from './base-make.command.js';

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
    public getStub(): string {
        return resolveStub('modules/http/controllers/controller.stub');
    }

    public handle(): void {
        const [name] = this.args;
        this.getContent();
        this.replaceContent([
            {
                search: '$$CLASS$$',
                value: this.getClassName(name)
            },
            {
                search: '$$CONTROLLER_NAME$$',
                value: name
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
