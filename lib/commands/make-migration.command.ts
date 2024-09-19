import { Injectable } from '@nestjs/common';
import { camelCase, difference, upperFirst } from 'lodash';
import { resolve } from 'path';
import { DataSource } from 'typeorm';
import { ColumnMetadata } from 'typeorm/metadata/ColumnMetadata';
import { EntityMetadata } from 'typeorm/metadata/EntityMetadata';
import { Command } from '../decorators/command.decorator';
import { BaseMakeCommand } from './base-make.command';

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

    constructor(private dataSource: DataSource) {
        super();
    }

    public getStub(): string {
        return resolve(__dirname, '../stubs/make-migration.stub');
    }

    public async handle(): Promise<void> {
        const [name] = this.program.args;
        this.name = name;
        const { create, update } = this.program.opts();
        this.getContent();
        const className = upperFirst(camelCase(name));
        const currentTime = +new Date();
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
                ...this.generateAddNewColumnContent(newColumns, this.dataSource.getMetadata(this.tableName)),
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

    public getRunCreateContent(): string {
        const entity = this.dataSource.getMetadata(this.tableName);
        const columns = entity.columns;
        const data = [`await this.create('${entity.tableName}', (table) => {`];
        data.push(...this.generateAddNewColumnContent(columns, entity));
        data.push(`});`);

        return data.join('\n');
    }

    public getRunUpdateContent(content: string[]): string {
        return `await this.update('${this.tableName}', (table) => { ${content.join('\n')}});`;
    }

    public getRollbackCreateContent(): string {
        return `await this.drop('${this.tableName}');`;
    }

    private async getUpdateColumnsMetaData(): Promise<{ removedColumnsName: string[]; newColumns: ColumnMetadata[] }> {
        const queryRunner = this.dataSource.createQueryRunner();
        const tables = await queryRunner.getTables([this.tableName]);
        const tableColumnsMetaData = tables[0].columns;
        const entityColumnsMetadata = this.dataSource.getMetadata(this.tableName).columns;

        const tableColumnsName = tableColumnsMetaData.map((item) => item.name);
        const entityColumnsName = entityColumnsMetadata.map((item) => item.databaseName);

        const removedColumnsName = difference(tableColumnsName, entityColumnsName);
        const newColumns = difference(entityColumnsName, tableColumnsName);

        return {
            removedColumnsName,
            newColumns: entityColumnsMetadata.filter((item) => newColumns.includes(item.databaseName))
        };
    }

    private generateAddNewColumnContent(columns: ColumnMetadata[], entity: EntityMetadata): string[] {
        const data = [];
        for (const column of columns) {
            delete column.entityMetadata;

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
                    const type = this.getType(column);
                    let command = `table.${type}('${column.propertyName}')`;
                    command = command + this.appendCommand(column, entity);
                    data.push(command);
                }
            }
        }
        return data;
    }

    private appendCommand(column: ColumnMetadata, entity: EntityMetadata): string {
        let command = '';
        if (column.isNullable) {
            command += '.nullable()';
        }
        if (column.length) {
            command += `.length(${column.length})`;
        }
        if (typeof column.default !== 'undefined') {
            if (typeof column.default === 'string') {
                command += `.default("'${column.default}'")`;
            } else {
                command += `.default(${column.default})`;
            }
        }
        if (this.isIndex(column.propertyName, entity)) {
            command += `.index()`;
        }
        command += ';';
        return command;
    }

    private getType(column: ColumnMetadata): string {
        const type = typeof column.type === 'string' ? column.type : column.type.name.toLowerCase();
        if (type === 'number') {
            return 'integer';
        }
        if (type === 'character varying') {
            return 'string';
        }
        return type;
    }

    private generateRemoveColumnContent(columnsName: string[]): string[] {
        const data = [];
        for (const column of columnsName) {
            data.push(`table.dropColumn('${column}');`);
        }
        return data;
    }

    public isIndex(column: string, entity: EntityMetadata): boolean {
        for (const index of entity.indices) {
            if (index.columns.length === 1) {
                return index.columns.some((c) => c.propertyName === column);
            }
        }
        return false;
    }
}
