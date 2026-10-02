import axiosInstance from "@/config/axios";

// 1. Lấy Challenge đăng ký Passkey cho thiết bị (Cần đăng nhập)
export const getWebAuthnRegisterOptionsAPI = async () => {
  const response = await axiosInstance.post("/auth/webauthn/register-options");
  return response.data?.data || response.data;
};

// 2. Gửi Chữ ký xác thực đăng ký Passkey về Server
export const verifyWebAuthnRegisterAPI = async (
  registrationResponse: any,
  challenge: string
) => {
  const response = await axiosInstance.post("/auth/webauthn/register-verify", {
    registrationResponse,
    challenge,
  });
  return response.data?.data || response.data;
};

// 3. Lấy Challenge đăng nhập cho Email (Công khai)
export const getWebAuthnLoginChallengeAPI = async (email: string) => {
  const response = await axiosInstance.post("/auth/webauthn/login-challenge", {
    email,
  });
  return response.data?.data || response.data;
};

// 4. Gửi Chữ ký xác thực đăng nhập về Server
export const verifyWebAuthnLoginAPI = async (
  email: string,
  authResponse: any,
  challenge: string
) => {
  const response = await axiosInstance.post("/auth/webauthn/login-verify", {
    email,
    authResponse,
    challenge,
  });
  return response.data?.data || response.data;
};
