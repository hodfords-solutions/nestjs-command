import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class TestScheduleTask {
    constructor() {}

    @Cron(CronExpression.EVERY_WEEKEND, { name: 'TestSchedule'})
    testSchedule() {
        console.log('Running the test schedule task');
    }
}
