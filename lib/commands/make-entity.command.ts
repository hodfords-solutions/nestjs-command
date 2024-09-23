import { Injectable } from '@nestjs/common';
import { resolve } from 'path';
import { Command } from '../decorators/command.decorator';
import { BaseMakeCommand } from './base-make.command';

@Command({
    signature: 'make-entity <name>',
    description: 'Make an entity',
    options: [
        {
            value: '--module <module>',
            description: 'Module'
        }
    ]
})
@Injectable()
export class MakeEntityCommand extends BaseMakeCommand {
    public getStub(): string {
        return resolve(__dirname, '../stubs/modules/entities/entity.stub');
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
        this.writeFileToModule('entities', `${this.getFileName(name)}.entity.ts`);
        this.success(`Create entity ${name} successfully!`);
    }
}
