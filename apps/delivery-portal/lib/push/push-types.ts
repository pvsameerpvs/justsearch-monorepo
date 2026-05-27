export type PushSyncStatus = "idle" | "syncing" | "synced" | "failed";

export interface PushActionResult {
  success: boolean;
  error?: string;
  permission?: string;
  pushEnabled: boolean;
  subscribed: boolean;
  syncStatus: PushSyncStatus;
}
