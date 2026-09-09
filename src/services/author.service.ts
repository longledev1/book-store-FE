import axiosInstance from "@/config/axios";
import { ADMIN_API_URL, CLIENT_API_URL } from "@/config/apiEndpoints";

import { type Media } from "./media.service";

export interface Author {
  id: string;
  createdAt: string;
  updatedAt: string;
  name: string;
  describe?: string | null;
  slug?: string | null;
  avatar?: Media | null;
}

export interface AuthorApiResponse {
  statusCode: number;
  message: string;
  data: Author[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface CreateAuthorPayload {
  name: string;
  describe?: string;
  mediaId?: string | null;
}

export interface UpdateAuthorPayload {
  name: string;
  describe?: string;
  mediaId?: string | null;
}

// GET AUTHORS API [GET] -- /admin/authors

export const getAuthorsAPI = async (page = 1, limit = 10, keyword?: string) => {
  const response = await axiosInstance.get<AuthorApiResponse>(
    ADMIN_API_URL.AUTHORS,
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

// GET AUTHOR BY ID API [GET] -- /admin/authors/:authorId

export const getAuthorByIdAPI = async (id: string) => {
  const response = await axiosInstance.get(ADMIN_API_URL.AUTHOR_BY_ID(id));

  return response.data;
};

// CREATE AUTHOR API [POST] -- /admin/authors

export const createAuthorAPI = async (data: CreateAuthorPayload) => {
  const response = await axiosInstance.post(ADMIN_API_URL.CREATE_AUTHOR, data);

  return response.data;
};

// UPDATE AUTHOR API [PATCH] -- /admin/authors/:authorId

export const updateAuthorAPI = async (
  id: string,
  data: UpdateAuthorPayload,
) => {
  const response = await axiosInstance.patch(
    ADMIN_API_URL.UPDATE_AUTHOR(id),
    data,
  );

  return response.data;
};

// DELETE AUTHOR API [DELETE] -- /admin/authors/:authorId

export const deleteAuthorAPI = async (id: string) => {
  const response = await axiosInstance.delete(ADMIN_API_URL.DELETE_AUTHOR(id));

  return response.data;
};

// RESTORE AUTHOR API [POST] -- /admin/authors/restore/:authorId

export const restoreAuthorAPI = async (id: string) => {
  const response = await axiosInstance.post(ADMIN_API_URL.RESTORE_AUTHOR(id));

  return response.data;
};

// GET DELETED AUTHORS API [GET] -- /admin/authors/soft-delete/get

export const getDeletedAuthorsAPI = async (
  page = 1,
  limit = 10,
  keyword?: string,
) => {
  const response = await axiosInstance.get<AuthorApiResponse>(
    ADMIN_API_URL.DELETED_AUTHORS,
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

// HARD DELETE AUTHOR API [DELETE] -- /admin/authors/hard/:authorId

export const hardDeleteAuthorAPI = async (id: string) => {
  const response = await axiosInstance.delete(
    ADMIN_API_URL.HARD_DELETE_AUTHOR(id),
  );

  return response.data;
};

// GET AUTHORS FOR CLIENT API [GET] -- /authors

export const getAuthorsForClientAPI = async (page = 1, limit = 10) => {
  const response = await axiosInstance.get<AuthorApiResponse>(
    CLIENT_API_URL.AUTHORS,
    {
      params: {
        page,
        limit,
      },
    },
  );
  return response.data;
};

// GET AUTHOR BY SLUG FOR CLIENT API [GET] -- /authors/:slug
export const getAuthorBySlugForClientAPI = async (slug: string) => {
  const response = await axiosInstance.get(CLIENT_API_URL.AUTHOR_BY_SLUG(slug));
  return response.data;
};

// GET AUTHOR BY ID FOR CLIENT API [GET] -- /authors/id/:id
export const getAuthorByIdForClientAPI = async (id: string) => {
  const response = await axiosInstance.get(CLIENT_API_URL.AUTHOR_BY_ID(id));
  return response.data;
};
