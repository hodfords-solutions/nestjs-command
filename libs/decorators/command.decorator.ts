export interface CommandOption {
    signature: string;
    description?: any;
    params?: any;
    options?: any[];
    requiredOptions?: any[];
}

export const COMMAND_KEY = 'command:options';

export function Command(options: CommandOption) {
    return function (constructor) {
        Reflect.defineMetadata(COMMAND_KEY, options, constructor);
        return constructor;
    };
}
