import { Module } from '@nestjs/common';
import { commandConfig } from 'src/config/command.config';
import { ScheduleModule } from '@nestjs/schedule';
import { TestScheduleTask } from 'src/tasks/test-schedule.task';

@Module({
    imports: [commandConfig, ScheduleModule.forRoot()],
    controllers: [],
    providers: [TestScheduleTask]
})
export class AppModule {}