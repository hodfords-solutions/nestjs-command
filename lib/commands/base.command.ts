import { Command } from 'commander';
import { Logger } from '@nestjs/common';

export abstract class BaseCommand {
    protected program: Command;
    private logger = new Logger();

    abstract handle(): void;

    get params(): string[] {
        return this.program.args;
    }

    public success(message): void {
        this.logger.log(message);
    }

    public error(message): void {
        this.logger.error(message);
    }

    public info(message): void {
        this.logger.log(message);
    }

    public warn(message): void {
        this.logger.warn(message);
    }
}
