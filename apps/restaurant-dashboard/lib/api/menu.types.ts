export type MenuCategoryData = {
  id: string;
  name: string;
  description: string | null;
  sortOrder: number;
  status: string;
  createdAt: string;
};

export type MenuItemData = {
  id: string;
  menuId: string;
  categoryId: string | null;
  name: string;
  description: string | null;
  price: string;
  imageUrl: string | null;
  tags: string[];
  isVeg: boolean;
  isAvailable: boolean;
  sortOrder: number;
  createdAt: string;
};

export type CreateMenuItemPayload = {
  name: string;
  description?: string;
  price: number;
  imageUrl?: string;
  tags?: string[];
  isAvailable?: boolean;
  categoryId?: string;
  menuId?: string;
};

export type UpdateMenuItemPayload = Partial<CreateMenuItemPayload>;

export type CreateCategoryPayload = {
  name: string;
  description?: string;
  sortOrder?: number;
};

export type UpdateCategoryPayload = Partial<CreateCategoryPayload>;
