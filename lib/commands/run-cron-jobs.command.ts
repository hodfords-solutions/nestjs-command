import { Injectable } from '@nestjs/common';
import { Command } from '../decorators/command.decorator.js';
import { BaseCommand } from './base.command.js';
import { SchedulerRegistry } from '@nestjs/schedule';

@Command({
    signature: 'run-cron-jobs',
    description: 'Run specified cron jobs',
    options: [
        {
            value: '--jobs <jobs...>',
            description: 'List of cron jobs to run'
        }
    ]
})
@Injectable()
export class RunCronJobsCommand extends BaseCommand {
    constructor(private readonly schedulerRegistry: SchedulerRegistry) {
        super();
    }

    public async handle(): Promise<void> {
        const { jobs } = this.program.opts();

        if (!jobs || jobs.length === 0) {
            console.warn('No cron jobs specified.');
            return;
        }

        console.log(`Executing cron jobs: ${jobs.join(', ')}`);

        await Promise.all(
            jobs.map(async (jobName: string) => {
                const job = this.schedulerRegistry.getCronJob(jobName);
                if (!job) {
                    console.warn(`Cron job "${jobName}" not found.`);
                    return;
                }
                console.log(`Executing cron job "${jobName}"...`);
                job.waitForCompletion = true;
                await job.fireOnTick();
            })
        );

        console.log('Cron job execution completed.');
    }
}
