import { Injectable } from '@nestjs/common';
import { camelCase, upperFirst } from 'lodash';
import { BaseMakeCommand } from './base-make-command';
import { Command } from '../decorators/command.decorator';
import { Connection } from 'typeorm';
import { EntityMetadata } from 'typeorm/metadata/EntityMetadata';
import { ColumnMetadata } from 'typeorm/metadata/ColumnMetadata';
import { resolve } from 'path';

@Command({
    signature: 'make-migration <name>',
    description: 'Make a migration',
    options: [
        {
            value: '--module <module>',
            description: 'Module'
        },
        {
            value: '--create <create>',
            description: 'Table name'
        },
        {
            value: '--update <update>',
            description: 'Table name'
        }
    ],
    params: {
        command: 'BaseCommand name'
    }
})
@Injectable()
export class MakeMigrationCommand extends BaseMakeCommand {
    public name: string;
    public tableName: string;

    constructor(private connection: Connection) {
        super();
    }


    public getStub() {
        return resolve(__dirname, '../stubs/make-migration.stub');
    }

    public handle() {
        let [name] = this.program.args;
        this.name = name;
        let { create, update } = this.program.opts();
        this.getContent();
        let className = upperFirst(camelCase(name));
        let currentTime = +new Date();
        let runContent = '';
        let rollbackContent = '';
        if (create) {
            this.tableName = create;
            runContent = this.getRunCreateContent();
            rollbackContent = this.getRollbackCreateContent();
        } else if (update) {
            this.tableName = update;
            runContent = this.getRunUpdateContent();
            rollbackContent = this.getRunUpdateContent();
        }
        this.replaceContent([
            {
                search: '$$CLASS$$',
                value: `${className}${currentTime}`
            },
            {
                search: '$$RUN$$',
                value: runContent
            },
            {
                search: '$$ROLLBACK$$',
                value: rollbackContent
            }
        ]);
        this.writeFileToModule('databases/migrations', `${currentTime}-${name}.migration.ts`);
        this.success(`Create migration ${name} successfully!`);
    }

    public getRunCreateContent() {
        let entity = this.connection.getMetadata(this.tableName);
        let columns = entity.columns;
        let data = [`await this.create('${entity.tableName}', (table) => {`];
        for (let column of columns) {
            delete column.entityMetadata;
            this.createColumn(column, entity, data);
        }
        data.push(`});`);

        return data.join('\n');
    }

    private createColumn(column: ColumnMetadata, entity: EntityMetadata, data: string[]) {
        let type = '';

        if (column.isPrimary && column.isGenerated) {
            data.push(`table.primaryUuid('${column.propertyName}');`);
        } else {
            if (column.isCreateDate) {
                data.push(`table.createdAt();`);
            } else if (column.isUpdateDate) {
                data.push(`table.updatedAt();`);
            } else if (column.isDeleteDate) {
                data.push(`table.deletedAt();`);
            } else {
                if (typeof column.type === 'string') {
                    type = column.type;
                } else {
                    type = column.type.name.toLowerCase();
                }
                if (type === 'number') {
                    type = 'integer';
                }
                if (type === 'character varying') {
                    type = 'string';
                }
                let command = `table.${type}('${column.propertyName}')`;
                if (column.isNullable) {
                    command += '.nullable()';
                }
                if (column.length) {
                    command += `.length(${column.length})`;
                }
                if (column.default) {
                    if (typeof column.default === 'string') {
                        command += `.default('${column.default}')`;
                    } else {
                        command += `.default(${column.default})`;
                    }
                }
                if (this.isIndex(column.propertyName, entity)) {
                    command += `.index()`;
                }
                command += ';';
                data.push(command);
            }
        }
    }

    public getRunUpdateContent() {
        return `await this.update('${this.tableName}', (table) => { });`;
    }

    public getRollbackCreateContent() {
        return `await this.drop('${this.tableName}');`;
    }

    public isIndex(column: string, entity: EntityMetadata) {
        for (let index of entity.indices) {
            if (index.columns.length === 1) {
                return index.columns.find((c) => c.propertyName === column);
            }
        }
        return false;
    }
}
