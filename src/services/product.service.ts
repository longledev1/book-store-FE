import axiosInstance from "@/config/axios";
import { ADMIN_API_URL, CLIENT_API_URL } from "@/config/apiEndpoints";

export interface BookDetail {
  id?: string;
  publisher?: string;
  publishDate?: string;
  publishYear?: number;
  pages?: number;
  pageCount?: number;
  dimensions?: string;
  weight?: number;
  coverType?: string;
  format?: string;
  language?: string;
  describe?: string;
  [key: string]: any;
}

export interface AlbumItem {
  mediaId: string;
  displayOrder: number;
  [key: string]: any;
}

export interface Product {
  id: string;
  createdAt: string;
  updatedAt: string;
  name: string;
  slug: string;
  status: number;
  isVerified: boolean;
  price: number;
  describe?: string;
  imgUrl?: string;
  categoryIds?: string[];
  authorIds?: string[];
  bookDetail?: BookDetail;
  albums?: AlbumItem[];
}

export interface ProductApiResponse {
  statusCode: number;
  message: string;
  data: Product[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface CreateProductPayload {
  name: string;
  slug?: string;
  cost?: number;
  price?: number;
  finalPrice?: number;
  status?: number;
  isVerified?: boolean;
  shortDescribe?: string;
  imgUrl?: string;
  categoryIds?: string[];
  authorIds?: string[];
  bookDetail?: BookDetail;
  albums?: AlbumItem[];
}

export interface UpdateProductPayload {
  name?: string;
  slug?: string;
  cost?: number;
  price?: number;
  finalPrice?: number;
  status?: number;
  isVerified?: boolean;
  shortDescribe?: string;
  imgUrl?: string;
  categoryIds?: string[];
  authorIds?: string[];
  bookDetail?: BookDetail;
  albums?: AlbumItem[];
}

// GET PRODUCTS API [GET] -- /admin/products

export const getProductsAPI = async (
  page = 1,
  limit = 10,
  keyword?: string,
  status?: number | string,
  isVerified?: boolean | string,
  orderBy?: string,
  sort?: string,
  categoryId?: string,
  authorId?: string,
) => {
  const response = await axiosInstance.get<ProductApiResponse>(
    ADMIN_API_URL.PRODUCTS,
    {
      params: {
        page,
        limit,
        ...(keyword && { keyword }),
        ...(status !== undefined && status !== "" && { status }),
        ...(isVerified !== undefined && isVerified !== "" && { isVerified }),
        ...(orderBy && { orderBy }),
        ...(sort && { sort }),
        ...(categoryId && { categoryId }),
        ...(authorId && { authorId }),
      },
    },
  );

  return response.data;
};

// GET PRODUCT BY ID API [GET] -- /admin/products/:productId

export const getProductByIdAPI = async (id: string) => {
  const response = await axiosInstance.get(ADMIN_API_URL.PRODUCT_BY_ID(id));

  return response.data;
};

// CREATE PRODUCT API [POST] -- /admin/products

export const createProductAPI = async (data: CreateProductPayload) => {
  const response = await axiosInstance.post(ADMIN_API_URL.CREATE_PRODUCT, data);

  return response.data;
};

// UPDATE PRODUCT API [PATCH] -- /admin/products/:productId

export const updateProductAPI = async (id: string, data: UpdateProductPayload) => {
  const response = await axiosInstance.patch(
    ADMIN_API_URL.UPDATE_PRODUCT(id),
    data,
  );

  return response.data;
};

// DELETE PRODUCT API [DELETE] -- /admin/products/:productId

export const deleteProductAPI = async (id: string) => {
  const response = await axiosInstance.delete(ADMIN_API_URL.DELETE_PRODUCT(id));

  return response.data;
};

// RESTORE PRODUCT API [POST] -- /admin/products/restore/:productId

export const restoreProductAPI = async (id: string) => {
  const response = await axiosInstance.post(ADMIN_API_URL.RESTORE_PRODUCT(id));

  return response.data;
};

// GET DELETED PRODUCTS API [GET] -- /admin/products/soft-delete/get

export const getDeletedProductsAPI = async (
  page = 1,
  limit = 10,
  keyword?: string,
) => {
  const response = await axiosInstance.get<ProductApiResponse>(
    ADMIN_API_URL.DELETED_PRODUCTS,
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

// HARD DELETE PRODUCT API [DELETE] -- /admin/products/hard/:productId

export const hardDeleteProductAPI = async (id: string) => {
  const response = await axiosInstance.delete(
    ADMIN_API_URL.HARD_DELETE_PRODUCT(id),
  );

  return response.data;
};

// GET PRODUCTS FOR CLIENT API [GET] -- /products (Supports authorId, categoryId, keyword, etc.)

export const getProductsForClientAPI = async (
  page = 1,
  limit = 10,
  keyword?: string,
  categoryId?: string,
  authorId?: string,
  orderBy?: string,
  sort?: string,
) => {
  const response = await axiosInstance.get<ProductApiResponse>(
    CLIENT_API_URL.PRODUCTS,
    {
      params: {
        page,
        limit,
        ...(keyword && { keyword }),
        ...(categoryId && { categoryId }),
        ...(authorId && { authorId }),
        ...(orderBy && { orderBy }),
        ...(sort && { sort }),
      },
    },
  );

  return response.data;
};
