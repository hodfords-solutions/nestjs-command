import { Injectable } from '@nestjs/common';
import { Command } from '../decorators/command.decorator.js';
import { BaseMakeCommand, resolveStub } from './base-make.command.js';

@Command({
    signature: 'make-service <name>',
    description: 'Make a service',
    options: [
        {
            value: '--module <module>',
            description: 'Module'
        }
    ]
})
@Injectable()
export class MakeServiceCommand extends BaseMakeCommand {
    public getStub(): string {
        return resolveStub('modules/services/service.stub');
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
                search: '$$PROPERTY$$',
                value: this.getPropertyName(name)
            },
            {
                search: '$$FILENAME$$',
                value: this.getFileName(name)
            }
        ]);
        this.writeFileToModule('services', `${name}.service.ts`);
        this.success(`Create service ${name} successfully!`);
    }
}
