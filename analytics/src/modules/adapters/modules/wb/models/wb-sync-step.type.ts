import { SyncScope } from "src/modules/sync/modules/sync-logs/models/sync-scope.enum";
import { SyncResult } from "src/modules/sync/modules/sync-snapshots/models/sync-result.interface";

export type WbSyncStep = (apiToken: string) => Promise<SyncResult>
export type WbSyncMultyStep = [SyncScope, WbSyncStep]