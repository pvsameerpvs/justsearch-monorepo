import { getDeliveryPortalSnapshotBySlug } from './mock-delivery-data';
import type { DeliveryPortalSnapshot } from './delivery-types';

export async function getCurrentDeliveryPortalSnapshot(): Promise<DeliveryPortalSnapshot> {
  return getDeliveryPortalSnapshotBySlug('mosaic-table');
}
