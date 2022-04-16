import { Injectable } from '@nestjs/common';
import { camelCase, upperFirst } from 'lodash';
import { BaseMakeCommand } from './base-make.command';
import { Command } from '../decorators/command.decorator';
import { Connection, getConnection } from 'typeorm';
import { EntityMetadata } from 'typeorm/metadata/EntityMetadata';
import { ColumnMetadata } from 'typeorm/metadata/ColumnMetadata';
import { resolve } from 'path';
import { difference } from 'lodash';

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

    public async handle() {
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
            const { newColumns, removedColumnsName } = await this.getUpdateColumnsMetaData();
            runContent = this.getRunUpdateContent([
                ...this.generateAddNewColumnContent(newColumns, this.connection.getMetadata(this.tableName)),
                ...this.generateRemoveColumnContent(removedColumnsName)
            ]);
            rollbackContent = '';
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
        data.push(...this.generateAddNewColumnContent(columns, entity));
        data.push(`});`);

        return data.join('\n');
    }

    public getRunUpdateContent(content: string[]) {
        return `await this.update('${this.tableName}', (table) => { ${content.join('\n')}});`;
    }

    public getRollbackCreateContent() {
        return `await this.drop('${this.tableName}');`;
    }

    private async getUpdateColumnsMetaData() {
        const connection = getConnection();
        const queryRunner = connection.createQueryRunner();
        const tables = await queryRunner.getTables([this.tableName]);
        const tableColumnsMetaData = tables[0].columns;
        const entityColumnsMetadata = connection.getMetadata(this.tableName).columns;

        const tableColumnsName = tableColumnsMetaData.map((item) => item.name);
        const entityColumnsName = entityColumnsMetadata.map((item) => item.databaseName);

        const removedColumnsName = difference(tableColumnsName, entityColumnsName);
        const newColumns = difference(entityColumnsName, tableColumnsName);

        return {
            removedColumnsName,
            newColumns: entityColumnsMetadata.filter((item) => newColumns.includes(item.databaseName))
        };
    }

    private generateAddNewColumnContent(columns: ColumnMetadata[], entity: EntityMetadata) {
        const data = [];
        for (let column of columns) {
            delete column.entityMetadata;
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
        return data;
    }

    private generateRemoveColumnContent(columnsName: string[]) {
        const data = [];
        for (const column of columnsName) {
            data.push(`table.dropColumn('${column}');`);
        }
        return data;
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
