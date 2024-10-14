import { Global, Injectable } from '@nestjs/common';
import { ModulesContainer } from '@nestjs/core';
import { Command } from 'commander';
import { COMMAND_KEY } from './decorators/command.decorator';

@Global()
@Injectable()
export class CommandService {
    constructor(private modulesContainer: ModulesContainer) {}

    async exec(): Promise<void> {
        const program = new Command();
        const providerModules = [...this.modulesContainer.values()].map((module) => module.providers.values());
        for (const providerModule of providerModules) {
            for (const provider of providerModule) {
                const { instance } = provider;
                if (!instance || !instance.constructor) {
                    continue;
                }
                const meta = Reflect.getMetadata(COMMAND_KEY, instance.constructor);
                if (meta) {
                    this.addCommand(program, instance, meta);
                }
            }
        }
        await program.parseAsync();
    }

    public addCommand(program, instance, meta): void {
        const commandBuilder = new Command().command(meta.signature);
        if (meta.description) {
            commandBuilder.description(meta.description, meta.params);
        }
        if (meta.options) {
            for (const option of meta.options) {
                commandBuilder.option(option.value, option.description);
            }
        }

        if (meta.requiredOptions) {
            for (const option of meta.requiredOptions) {
                commandBuilder.requiredOption(option.value, option.description);
            }
        }

        for (const param of Object.keys(meta.params || {})) {
            commandBuilder.addHelpCommand(new Command(param).description(meta.params[param]));
        }

        commandBuilder.action(async () => {
            instance.program = commandBuilder;
            await instance.handle();
            process.exit();
        });
        program.addCommand(commandBuilder);
    }
}
