import { SyncScope } from "./sync-scope.enum";

export interface SyncError {
    scope: SyncScope;
    message: string;
}