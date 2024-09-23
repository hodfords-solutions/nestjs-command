import chalk from 'chalk';
import { Command } from 'commander';

export abstract class BaseCommand {
    protected program: Command;

    abstract handle(): void;

    get params(): string[] {
        return this.program.args;
    }

    public success(message): void {
        console.log(chalk.green(message));
    }

    public error(message): void {
        console.log(chalk.red(message));
    }

    public info(message): void {
        console.log(chalk.blue(message));
    }

    public warn(message): void {
        console.log(chalk.yellow(message));
    }
}
