import { mkdirSync, readFileSync, writeFileSync } from 'fs';
import { camelCase, escapeRegExp, kebabCase, startCase, upperFirst } from 'es-toolkit';
import path from 'path';
import { fileURLToPath } from 'url';
import { BaseCommand } from './base.command.js';

const currentDirectory = path.dirname(fileURLToPath(import.meta.url));

/**
 * Resolve a stub file shipped with the package, relative to the compiled `commands` directory.
 */
export function resolveStub(...segments: string[]): string {
    return path.resolve(currentDirectory, '../stubs', ...segments);
}

export abstract class BaseMakeCommand extends BaseCommand {
    public content: string;
    private customArgs: string[] | null = null;
    private customOptions: (object & { module?: string }) | null = null;

    abstract getStub(): string;

    public getContent(): void {
        this.content = readFileSync(this.getStub()).toString();
    }

    public replaceContent(contents: { search: string; value: string }[]): void {
        for (const content of contents) {
            const regex = new RegExp(escapeRegExp(content.search), 'g');
            this.content = this.content.replace(regex, content.value);
        }
    }

    public writeFile(pathName: string, fileName: string): void {
        writeFileSync(path.join(process.cwd(), pathName, fileName), this.content);
    }

    public writeFileToModule(pathName: string, fileName: string): void {
        const fullPath = this.getModulePath(pathName);
        mkdirSync(fullPath, { recursive: true });
        this.writeFile(fullPath, fileName);
    }

    public getModulePath(pathName: string): string {
        if (this.opts.module) {
            return path.join('src', this.opts.module, pathName);
        }
        return path.join('src', pathName);
    }

    public get args(): string[] {
        return this.customArgs || this.program.args;
    }

    public get opts(): object & { module?: string } {
        return this.customOptions || this.program.opts();
    }

    public runWith(args?: string[], opts?: object & { module?: string }): void {
        this.customArgs = args ?? null;
        this.customOptions = opts ?? null;
        return this.handle();
    }

    public getClassName(name: string): string {
        return upperFirst(camelCase(name));
    }

    public getPropertyName(name: string): string {
        return camelCase(name);
    }

    public getFileName(name: string): string {
        return kebabCase(name);
    }

    public getTitleName(name: string): string {
        return startCase(camelCase(name));
    }
}
