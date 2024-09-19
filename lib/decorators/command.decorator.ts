export interface CommandOption {
    signature: string;
    description?: string;
    params?: object;
    options?: object[];
    requiredOptions?: object[];
}

export const COMMAND_KEY = 'command:options';

export function Command(options: CommandOption) {
    return function <T>(constructor: T): T {
        Reflect.defineMetadata(COMMAND_KEY, options, constructor);
        return constructor;
    };
}
