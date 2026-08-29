export interface CommandOptionFlag {
    value: string;
    description?: string;
}

export interface CommandOption {
    signature: string;
    description?: string;
    params?: Record<string, string>;
    options?: CommandOptionFlag[];
    requiredOptions?: CommandOptionFlag[];
}

export const COMMAND_KEY = 'command:options';

export function Command(options: CommandOption) {
    return function <T extends object>(constructor: T): T {
        Reflect.defineMetadata(COMMAND_KEY, options, constructor);
        return constructor;
    };
}
