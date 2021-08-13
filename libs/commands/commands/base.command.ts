import chalk from 'chalk';
import { Command } from 'commander';

export abstract class BaseCommand {
    protected program: Command;

    abstract handle();

    get params() {
        return this.program.args;
    }

    public success(message) {
        console.log(chalk.green(message));
    }

    public error(message) {
        console.log(chalk.red(message));
    }

    public info(message) {
        console.log(chalk.blue(message));
    }

    public warn(message) {
        console.log(chalk.yellow(message));
    }
}
