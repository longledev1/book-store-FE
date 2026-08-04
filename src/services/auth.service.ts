import axiosInstance from "@/config/axios";
import { CLIENT_API_URL } from "@/config/apiEndpoints";

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
  fullName: string;
  phone: string;
}

export interface ForgotPasswordCredentials {
  email: string;
}

export interface ResetPasswordCredentials {
  token: string;
  newPassword: string;
}

// LOGIN API [POST] -- /auth/login

export const loginAPI = async (credentials: LoginCredentials) => {
  const response = await axiosInstance.post(
    CLIENT_API_URL.AUTH_LOGIN,
    credentials,
  );
  return response.data;
};

// REGISTER API [POST] -- /auth/register

export const registerAPI = async (credentials: RegisterCredentials) => {
  const response = await axiosInstance.post(
    CLIENT_API_URL.AUTH_REGISTER,
    credentials,
  );
  return response.data;
};

// GET PROFILE API [GET] -- /user/me

export const getProfileAPI = async () => {
  const response = await axiosInstance.get(CLIENT_API_URL.USER_PROFILE);
  return response.data;
};

// FORGOT PASSWORD API [POST] -- /auth/forgot-password

export const forgotPasswordAPI = async (
  credentials: ForgotPasswordCredentials,
) => {
  const response = await axiosInstance.post(
    CLIENT_API_URL.AUTH_FORGOT_PASSWORD,
    credentials,
  );
  return response.data;
};

// RESET PASSWORD API [POST] -- /auth/reset-password

export const resetPasswordAPI = async (
  credentials: ResetPasswordCredentials,
) => {
  const response = await axiosInstance.post(
    CLIENT_API_URL.AUTH_RESET_PASSWORD,
    credentials,
  );
  return response.data;
};
