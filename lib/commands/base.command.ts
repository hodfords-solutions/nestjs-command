import { Command } from 'commander';
import { Logger } from '@nestjs/common';

export abstract class BaseCommand {
    protected program: Command;
    private logger = new Logger();

    abstract handle(): void;

    get params(): string[] {
        return this.program.args;
    }

    public success(message: unknown): void {
        this.logger.log(message);
    }

    public error(message: unknown): void {
        this.logger.error(message);
    }

    public info(message: unknown): void {
        this.logger.log(message);
    }

    public warn(message: unknown): void {
        this.logger.warn(message);
    }
}
