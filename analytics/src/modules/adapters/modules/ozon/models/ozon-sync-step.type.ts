import { SyncScope } from "src/modules/sync/modules/sync-logs/models/sync-scope.enum";
import { SyncResult } from "src/modules/sync/modules/sync-snapshots/models/sync-result.interface";
import { OzonApiCredentials } from "./credentials.type";

export type OzonSyncStep = (credentials: OzonApiCredentials) => Promise<SyncResult>
export type OzonSyncMultyStep = [SyncScope, OzonSyncStep]