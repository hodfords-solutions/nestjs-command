import { Injectable } from '@nestjs/common';
import { Command } from '../decorators/command.decorator';
import { BaseCommand } from './base.command';
import { SchedulerRegistry } from '@nestjs/schedule';

@Command({
    signature: 'list-cron-jobs',
    description: 'List all current cron jobs'
})
@Injectable()
export class ListCronJobsCommand extends BaseCommand {
    constructor(private readonly schedulerRegistry: SchedulerRegistry) {
        super();
    }

    public handle(): void {
        try {
            const jobs = this.schedulerRegistry.getCronJobs();

            if (!jobs.size) {
                console.warn('No cron jobs found.');
                return;
            }
            const jobList = Array.from(jobs.entries()).map(([name, job]) => ({
                ['Job Name']: name,
                ['Cron']: job.cronTime.source
            }));
            console.log('\nCurrent Cron Jobs:\n');
            console.table(jobList);
        } catch (error) {
            console.error('Failed to retrieve cron jobs:', error);
        }
    }
}
