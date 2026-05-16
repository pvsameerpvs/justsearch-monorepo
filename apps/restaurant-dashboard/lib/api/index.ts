export { apiClient } from './client';

export { uploadImage } from './upload.api';
export type { UploadResponse } from './upload.api';

export {
  fetchCategories,
  fetchMenuItems,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
  createCategory,
  updateCategory,
  deleteCategory,
} from './menu.api';
export type {
  MenuCategoryData,
  MenuItemData,
  CreateMenuItemPayload,
  UpdateMenuItemPayload,
  CreateCategoryPayload,
  UpdateCategoryPayload,
} from './menu.types';

export { fetchCurrentRestaurant, updateCurrentRestaurant } from './restaurant.api';
export type { RestaurantProfile } from './restaurant.api';
