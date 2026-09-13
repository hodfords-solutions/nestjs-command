import { spawnSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';

const CLI = resolve(import.meta.dirname, '../lib/bin/cli');

function writeJson(file: string, value: unknown): void {
    writeFileSync(file, JSON.stringify(value, null, 4));
}

/**
 * Lays out a minimal ESM app whose only TypeScript loader is a stand-in for
 * `@swc-node/register`: its `exports` map exposes `./esm` but not
 * `./package.json`, exactly like the published package.
 */
function scaffoldEsmApp(root: string): void {
    mkdirSync(join(root, 'src'), { recursive: true });
    writeJson(join(root, 'package.json'), { name: 'app', type: 'module' });
    writeFileSync(join(root, 'src/cli.ts'), "console.log('cli ran');\n");

    const loaderRoot = join(root, 'node_modules/@swc-node/register');
    mkdirSync(join(loaderRoot, 'esm'), { recursive: true });
    writeJson(join(loaderRoot, 'package.json'), {
        name: '@swc-node/register',
        exports: { '.': { node: './index.js' }, './esm': { import: './esm/esm.mjs' } }
    });
    writeFileSync(join(loaderRoot, 'index.js'), '');
    writeFileSync(join(loaderRoot, 'esm/esm.mjs'), "process.stdout.write('loader registered\\n');\n");
}

describe('bin/cli', () => {
    const roots: string[] = [];

    afterEach(() => {
        for (const root of roots.splice(0)) {
            rmSync(root, { recursive: true, force: true });
        }
    });

    it('registers a loader whose exports map hides package.json', () => {
        const root = mkdtempSync(join(tmpdir(), 'nestjs-command-'));
        roots.push(root);
        scaffoldEsmApp(root);

        const result = spawnSync(process.execPath, [CLI], { cwd: root, encoding: 'utf8' });

        expect(result.stderr).not.toContain('install ts-node');
        expect(result.stdout).toContain('loader registered');
        expect(result.stdout).toContain('cli ran');
        expect(result.status).toBe(0);
    });

    it('still fails clearly when no TypeScript loader is installed', () => {
        const root = mkdtempSync(join(tmpdir(), 'nestjs-command-'));
        roots.push(root);
        scaffoldEsmApp(root);
        rmSync(join(root, 'node_modules'), { recursive: true, force: true });

        const result = spawnSync(process.execPath, [CLI], { cwd: root, encoding: 'utf8' });

        expect(result.stderr).toContain('install ts-node, tsx or @swc-node/register');
        expect(result.status).toBe(1);
    });
});
