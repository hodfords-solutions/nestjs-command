import { Global, Injectable } from '@nestjs/common';
import { Command } from 'commander';
import { ModulesContainer } from '@nestjs/core';
import { COMMAND_KEY } from './decorators/command.decorator';

@Global()
@Injectable()
export class CommandService {
    constructor(private modulesContainer: ModulesContainer) {}

    async exec() {
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

    public addCommand(program, instance, meta) {
        const commandBuilder = new Command().command(meta.signature);
        if (meta.description) {
            commandBuilder.description(meta.description, meta.params);
        }
        if (meta.options) {
            for (let option of meta.options) {
                commandBuilder.option(option.value, option.description);
            }
        }

        if (meta.requiredOptions) {
            for (let option of meta.requiredOptions) {
                commandBuilder.requiredOption(option.value, option.description);
            }
        }
        commandBuilder.addHelpCommand(meta.params);
        commandBuilder.action(async () => {
            instance.program = commandBuilder;
            await instance.handle();
            process.exit();
        });
        program.addCommand(commandBuilder);
    }
}
