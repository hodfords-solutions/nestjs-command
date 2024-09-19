import { mkdirSync, readFileSync, writeFileSync } from 'fs';
import { camelCase, escapeRegExp, kebabCase, startCase, upperFirst } from 'lodash';
import path from 'path';
import { BaseCommand } from './base.command';

export abstract class BaseMakeCommand extends BaseCommand {
    public content: string;
    private customArgs = null;
    private customOptions = null;

    abstract getStub();

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

    public runWith(args: object = undefined, opts: object = undefined): void {
        this.customArgs = args;
        this.customOptions = opts;
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
