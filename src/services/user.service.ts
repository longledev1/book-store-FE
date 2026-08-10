import axiosInstance from "@/config/axios";
import { CLIENT_API_URL } from "@/config/apiEndpoints";

export interface UserProfile {
  fullName?: string;
  email?: string;
  phone?: string;
  address?: string;
  avatarUrl?: string;
}

export const updateProfileAPI = async (data: UserProfile) => {
  const response = await axiosInstance.put(
    CLIENT_API_URL.USER_UPDATE_PROFILE,
    data,
  );
  return response.data;
};
