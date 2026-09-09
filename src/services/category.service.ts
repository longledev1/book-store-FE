import axiosInstance from "@/config/axios";
import { ADMIN_API_URL } from "@/config/apiEndpoints";

export interface Category {
  id: string;
  createdAt: string;
  updatedAt: string;
  name: string;
  slug: string;
  isVerified: boolean;
  status: string;
  parentId: string | null;
  parent?: Category | null;
}

export interface CategoryApiResponse {
  statusCode: number;
  message: string;
  data: Category[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface CreateCategoryPayload {
  name: string;
  slug?: string;
  isVerified?: boolean;
  status?: number;
  parentId?: string | null;
}

export interface UpdateCategoryPayload {
  name: string;
  slug?: string;
  isVerified?: boolean;
  status?: number;
  parentId?: string;
}

// CREATE CATEGORY API [GET] -- /admin/categories

export const getCategoriesAPI = async (
  page = 1,
  limit = 10,
  keyword?: string,
  status?: number | string,
) => {
  const response = await axiosInstance.get<CategoryApiResponse>(
    ADMIN_API_URL.CATEGORIES,
    {
      params: {
        page,
        limit,
        ...(keyword && { keyword }),
        ...(status && { status }),
      },
    },
  );

  return response.data;
};

// GET CATEGORY TREE API [GET] -- /admin/categories/tree

export const getCategoryTreeAPI = async (
  keyword?: string,
  status?: number | string,
  isVerified?: boolean | string,
  orderBy?: string,
  sort?: string,
) => {
  const response = await axiosInstance.get(ADMIN_API_URL.CATEGORY_TREE, {
    params: {
      ...(keyword && { keyword }),
      ...(status !== undefined && status !== "" && { status }),
      ...(isVerified !== undefined && isVerified !== "" && { isVerified }),
      ...(orderBy && { orderBy }),
      ...(sort && { sort }),
    },
  });

  return response.data;
};

//  CREATE CATEGORY API [POST] -- /admin/categories

export const createCategoryAPI = async (data: CreateCategoryPayload) => {
  const response = await axiosInstance.post(
    ADMIN_API_URL.CREATE_CATEGORY,
    data,
  );
  return response.data;
};

//  UPDATE CATEGORY API [PATCH] -- /admin/categories/:categoryId

export const updateCategoryAPI = async (
  id: string,
  data: UpdateCategoryPayload,
) => {
  const response = await axiosInstance.patch(
    ADMIN_API_URL.UPDATE_CATEGORY(id),
    data,
  );

  return response.data;
};

// DELETE CATEGORY API [DELETE] -- /admin/categories/:categoryId

export const deleteCategoryAPI = async (id: string) => {
  const response = await axiosInstance.delete(
    ADMIN_API_URL.DELETE_CATEGORY(id),
  );

  return response.data;
};

// RESTORE CATEGORY API [POST] -- /admin/categories/restore/:categoryId

export const restoreCategoryAPI = async (id: string) => {
  const response = await axiosInstance.post(ADMIN_API_URL.RESTORE_CATEGORY(id));

  return response.data;
};

// GET DELETED CATEGORIES API [GET] -- /admin/categories/soft-delete/get

export const getDeletedCategoriesAPI = async (
  page = 1,
  limit = 10,
  keyword?: string,
) => {
  const response = await axiosInstance.get<CategoryApiResponse>(
    ADMIN_API_URL.DELETED_CATEGORIES,
    {
      params: {
        page,
        limit,
        ...(keyword && { keyword }),
      },
    },
  );

  return response.data;
};

// HARD DELETE CATEGORY API [DELETE] -- /admin/categories/hard/:categoryId

export const hardDeleteCategoryAPI = async (id: string) => {
  const response = await axiosInstance.delete(
    ADMIN_API_URL.HARD_DELETE_CATEGORY(id),
  );

  return response.data;
};
