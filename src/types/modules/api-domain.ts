import type { ApiTokenPair } from "./api-endpoints/auth";

export interface ApiOwner {
  id: string;
  name: string;
  phone: string;
}

export interface ApiUser {
  id: string;
  phone: string;
  name: string;
  defaultFamilyId: string | null;
  createdAt: string;
}

export type ApiUserSummary = Pick<ApiUser, "id" | "name" | "phone">;

export interface ApiFamily {
  id: string;
  name: string;
  ownerId: string;
  createdAt: string;
  owner?: ApiOwner;
  isDefault?: boolean;
}

export interface ApiFamilyMember {
  id: string;
  name: string;
  phone: string;
  joinedAt: string;
}

export interface ApiFamilyDetail extends ApiFamily {
  owner: ApiOwner;
  members: ApiFamilyMember[];
}

export interface ApiDish {
  id: string;
  familyId: string;
  name: string;
  categoryId: string;
  category: ApiMenuCategory;
  images: string[];
  ingredients: string;
  garnishes: string;
  method: string;
  createdAt: string;
}

export interface ApiMenuCategory {
  id: string;
  name: string;
  familyId: string;
  sortOrder: number;
  createdAt: string;
}

export interface ApiDraft {
  id: string;
  familyId: string;
  userId: string;
  name: string;
  dishIds: string[];
  createdAt: string;
  updatedAt: string;
  menu?: ApiDish[];
}

export interface ApiMemo {
  id: string;
  familyId: string;
  userId: string;
  name: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export type ApiOrderStatus = string;

export interface ApiOrder {
  id: string;
  orderNo: string;
  familyId: string;
  userId: string;
  status: ApiOrderStatus;
  note: string | null;
  createdAt: string;
  dishIds: string[];
  dishes: ApiDish[];
}

export interface LoginPayload {
  phone: string;
  name: string;
  password: string;
}

export interface LoginResult extends ApiTokenPair {
  user: ApiUser;
  families: ApiFamily[];
}

export interface MeResult {
  user: ApiUser;
  orderedDishCount: number;
}

export interface CreateFamilyPayload {
  name: string;
}

export interface SearchInvitationPayload {
  phone: string;
}

export interface SearchInvitationResult {
  user: ApiUserSummary | null;
}

export interface ConfirmInvitationPayload {
  phone: string;
}

export interface ConfirmInvitationResult {
  invited: true;
  user: Pick<ApiUser, "id" | "name" | "phone">;
}

export interface SearchJoinFamiliesPayload {
  ownerPhone: string;
}

export type SearchJoinFamiliesResult = {
  items: Array<ApiFamily & { owner: Pick<ApiOwner, "name" | "phone"> }>;
};

export interface JoinFamilyPayload {
  familyId: string;
}

export interface JoinFamilyResult {
  joined: true;
  family: ApiFamily;
}

export interface SetDefaultFamilyResult {
  defaultFamilyId: string;
}

export interface CreateCategoryPayload {
  name: string;
  sortOrder?: number;
}

export interface UpdateCategoryPayload {
  categoryId: string;
  name: string;
  sortOrder?: number;
}

export interface UpdateCategoryOrderPayload {
  categoryIds: string[];
}

export interface MenuListParams {
  [key: string]: string | undefined;
  search?: string;
  categoryId?: string;
}

export interface MenuListResult {
  categories: ApiMenuCategory[];
  items: ApiDish[];
}

export interface CreateDishPayload {
  name: string;
  categoryId: string;
  images?: string[];
  image?: string;
  ingredients?: string;
  garnishes?: string;
  accessories?: string;
  method?: string;
}

export interface UpdateDishPayload {
  dishId: string;
  name?: string;
  categoryId?: string;
  images?: string[];
  image?: string;
  ingredients?: string;
  garnishes?: string;
  accessories?: string;
  method?: string;
}

export interface CreateDraftPayload {
  name?: string;
  dishIds?: string[];
  menu?: string[];
}

export type UpdateDraftPayload = Partial<CreateDraftPayload>;

export interface DeleteDraftResult {
  deleted: true;
}

export interface CreateOrderPayload {
  dishIds?: string[];
  menu?: string[];
  note?: string;
}
