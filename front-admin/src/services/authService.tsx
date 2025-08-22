import api from "../api/axios";

// Типы для логина
interface LoginCredentials {
  email: string;
  password: string;
  recaptchaToken?: string; // əlavə elə buraya
}

// Типы для регистрации
export interface RegisterData {
  fname: string;
  lname: string;
  email: string;
  password: string;
}

// Ответ от сервера (можно расширить по необходимости)
export interface AuthResponse {
  token: string;
  user: {
    [x: string]: any;
    id: string;
    username: string;
    email: string;
    role: string;
  };
}

// Логин пользователя
export const loginUser = async (
  credentials: LoginCredentials
): Promise<AuthResponse> => {
  const response = await api.post("/api/auth/login", credentials);
  localStorage.setItem("token", response.data.token); // tokeni yaddaşa yaz
  return response.data;
};
// Регистрация пользователя

// // Logout funksiyası – refreshToken cookie-sini silir
// exports.logout = (
//   req: any,
//   res: {
//     clearCookie: (
//       arg0: string,
//       arg1: { httpOnly: boolean; secure: boolean; sameSite: string }
//     ) => void;
//     status: (arg0: number) => {
//       (): any;
//       new (): any;
//       json: { (arg0: { message: string }): any; new (): any };
//     };
//   }
// ) => {
//   res.clearCookie("refreshToken", {
//     httpOnly: true,
//     secure: true,
//     sameSite: "Strict",
//   });

//   return res.status(200).json({ message: "Çıxış edildi" });
// };
