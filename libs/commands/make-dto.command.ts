import { Injectable } from '@nestjs/common';
import { BaseMakeCommand } from './base-make.command';
import { Command } from '../decorators/command.decorator';
import { resolve } from 'path';

@Command({
    signature: 'make-dto <name>',
    description: 'Make a DTO',
    options: [
        {
            value: '--module <module>',
            description: 'Module'
        }
    ]
})
@Injectable()
export class MakeDtoCommand extends BaseMakeCommand {
    public getStub() {
        return resolve(__dirname, '../stubs/modules/http/dto/dto.stub');
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
        this.writeFileToModule('http/dto', `${this.getFileName(name)}.dto.ts`);
        this.success(`Create DTO ${name} successfully!`);
    }
}
