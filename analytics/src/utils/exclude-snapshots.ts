import { In, Not } from "typeorm";

export function excludeSnapshots(snapshotIds: string[]) {
    return snapshotIds.length ? Not(In(snapshotIds)) : undefined
}