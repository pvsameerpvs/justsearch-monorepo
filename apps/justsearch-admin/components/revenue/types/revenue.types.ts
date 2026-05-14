export interface AdSplitData {
  restaurantBrought: {
    total: number;
    restaurantShare: number;
    platformShare: number;
  };
  platformBrought: {
    total: number;
    platformShare: number;
    restaurantShare: number;
  };
}
