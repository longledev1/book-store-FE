import axiosInstance from "@/config/axios";
import { ADMIN_API_URL } from "@/config/apiEndpoints";

export interface Media {
  id: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  createBy: string;
  updateBy: string | null;
  deleteBy: string | null;

  folderPath: string;
  fileName: string;
  fileUrl: string;
  mimeType: string;
  size: number;
  provider: string;
  altText: string | null;
}

export interface MediaApiResponse {
  statusCode: number;
  message: string;
  data: Media[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface MediaFolder {
  folderPath: string;
  totalFiles: number;
}

export interface MediaFolderApiResponse {
  statusCode: number;
  message: string;
  data: MediaFolder[];
}

export interface UpdateMediaPayload {
  altText?: string;
}

export interface MoveMediaGroupPayload {
  mediaIds: string[];
  baseFolder: string;
  subFolder: string;
}

// GET MEDIA LIST API [GET] -- /admin/medias

export const getMediasAPI = async (
  page = 1,
  limit = 24,
  folderPath?: string,
  keyword?: string,
) => {
  const response = await axiosInstance.get<MediaApiResponse>(
    ADMIN_API_URL.MEDIAS,
    {
      params: {
        page,
        limit,
        ...(folderPath && { folderPath }),
        ...(keyword && { keyword }),
      },
    },
  );

  return response.data;
};

// GET MEDIA FOLDERS API [GET] -- /admin/medias/folders

export const getMediaFoldersAPI = async () => {
  const response = await axiosInstance.get<MediaFolderApiResponse>(
    ADMIN_API_URL.MEDIA_FOLDERS,
  );

  return response.data;
};

// GET MEDIA BY ID API [GET] -- /admin/medias/:id

export const getMediaByIdAPI = async (id: string) => {
  const response = await axiosInstance.get(ADMIN_API_URL.MEDIA_BY_ID(id));

  return response.data;
};

// UPLOAD MULTIPLE MEDIA API [POST]
// /admin/medias/upload-multiple
// folder + subFolder là QUERY PARAMS

export const uploadMultipleMediaAPI = async (
  files: File[],
  folder: string,
  subFolder?: string,
) => {
  const formData = new FormData();

  files.forEach((file) => {
    formData.append("files", file);
  });

  const response = await axiosInstance.post(
    ADMIN_API_URL.UPLOAD_MULTIPLE_MEDIA,
    formData,
    {
      params: {
        folder,
        ...(subFolder && { subFolder }),
      },
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );

  return response.data;
};

// UPDATE MEDIA API [PATCH] -- /admin/medias/:id

export const updateMediaAPI = async (id: string, data: UpdateMediaPayload) => {
  const response = await axiosInstance.patch(
    ADMIN_API_URL.UPDATE_MEDIA(id),
    data,
  );

  return response.data;
};

// DELETE MEDIA API [DELETE] -- /admin/medias/:id

export const deleteMediaAPI = async (id: string) => {
  const response = await axiosInstance.delete(ADMIN_API_URL.DELETE_MEDIA(id));

  return response.data;
};

// HARD DELETE MEDIA API [DELETE] -- /admin/medias/hard/:id

export const hardDeleteMediaAPI = async (id: string) => {
  const response = await axiosInstance.delete(
    ADMIN_API_URL.HARD_DELETE_MEDIA(id),
  );

  return response.data;
};

export const moveMediaGroupAPI = async (data: MoveMediaGroupPayload) => {
  const response = await axiosInstance.patch(
    ADMIN_API_URL.MOVE_MEDIA_GROUP,
    data,
  );

  return response.data;
};
