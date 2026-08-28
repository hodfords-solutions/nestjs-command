import { existsSync } from 'fs';
import { describe, expect, it } from 'vitest';

describe('package entry', () => {
    it('exports something', async () => {
        const mod = await import('../lib/index.js');
        expect(Object.keys(mod).length).toBeGreaterThan(0);
    });

    it('exposes the public API', async () => {
        const mod = await import('../lib/index.js');
        expect(mod.CommandModule).toBeDefined();
        expect(mod.CommandService).toBeDefined();
        expect(mod.BaseCommand).toBeDefined();
        expect(mod.BaseMakeCommand).toBeDefined();
        expect(mod.Command).toBeTypeOf('function');
    });

    it('resolves bundled stubs without __dirname', async () => {
        const { resolveStub } = await import('../lib/commands/base-make.command.js');
        const stub = resolveStub('make-command.stub');
        expect(stub.endsWith('stubs/make-command.stub')).toBe(true);
        expect(existsSync(stub)).toBe(true);
    });
});
