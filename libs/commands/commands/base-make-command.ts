import { mkdirSync, readFileSync, writeFileSync } from 'fs';
import path from 'path';
import { camelCase, escapeRegExp, kebabCase, upperFirst } from 'lodash';
import { BaseCommand } from './base.command';

export abstract class BaseMakeCommand extends BaseCommand {
    public content: string;
    private customArgs = null;
    private customOptions = null;

    abstract getStub();

    public getContent() {
        this.content = readFileSync(this.getStub()).toString();
    }

    public replaceContent(contents: { search: string; value: string }[]) {
        for (let content of contents) {
            let regex = new RegExp(escapeRegExp(content.search), 'g');
            this.content = this.content.replace(regex, content.value);
        }
    }

    public writeFile(pathName, fileName) {
        writeFileSync(path.join(process.cwd(), pathName, fileName), this.content);
    }

    public writeFileToModule(pathName, fileName) {
        let fullPath = this.getModulePath(pathName);
        mkdirSync(fullPath, { recursive: true });
        this.writeFile(fullPath, fileName);
    }

    public getModulePath(pathName) {
        if (this.opts.module) {
            return path.join('src', this.opts.module, pathName);
        }
        return path.join('src', pathName);
    }

    public get args() {
        return this.customArgs || this.program.args;
    }

    public get opts() {
        return this.customOptions || this.program.opts();
    }

    public runWith(args: any[] = undefined, opts: any = undefined) {
        this.customArgs = args;
        this.customOptions = opts;
        return this.handle();
    }

    public getClassName(name) {
        return upperFirst(camelCase(name));
    }

    public getPropertyName(name) {
        return camelCase(name);
    }

    public getFileName(name) {
        return kebabCase(name);
    }
}
