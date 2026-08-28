import { Injectable } from '@nestjs/common';
import { Command } from '../decorators/command.decorator.js';
import { BaseMakeCommand, resolveStub } from './base-make.command.js';

@Command({
    signature: 'make-repository <name>',
    description: 'Make a repository',
    options: [
        {
            value: '--module <module>',
            description: 'Module'
        }
    ]
})
@Injectable()
export class MakeRepositoryCommand extends BaseMakeCommand {
    public getStub(): string {
        return resolveStub('modules/repositories/repository.stub');
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
        this.writeFileToModule('repositories', `${name}.repository.ts`);
        this.success(`Create repository ${name} successfully!`);
    }
}
