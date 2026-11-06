import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { SyncService } from './sync.service';

const EVERY_HOUR = '0 0-23/1 * * *'
const EVERY_DAY_AT_1AM = '0 01 * * *'
const EVERY_DAY_AT_4AM = '0 04 * * *'
const EVERY_6H_STARTS_AT_3AM = '0 03-23/6 * * *'

@Injectable()
export class SyncScheduler {
    constructor(
        private readonly syncService: SyncService
    ) { }

    @Cron(EVERY_HOUR)
    handleHourlyTask() {
        this.syncService.autoSyncGeneral();
    }

    @Cron(EVERY_DAY_AT_1AM)
    handleDailyOneAMTask() {
        this.syncService.autoSyncWbOrders();
    }

    @Cron(EVERY_DAY_AT_4AM)
    handleDailyFourAMTask() {
        this.syncService.autoSyncOzonOrders();
    }

    @Cron(EVERY_6H_STARTS_AT_3AM)
    handleEverySixHoursTask() {
        this.syncService.autoSyncAds();
    }
}
