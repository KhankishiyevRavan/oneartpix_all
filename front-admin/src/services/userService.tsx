import api from "../api/axios";

// Tipler
export interface permissionsDataInterface {
  role: string;
  permissions: {
    create: boolean;
    read: boolean;
    edit: boolean;
    delete: boolean;
  };
}
interface Contract {
  _id: string;
  contractNumber: string;
  // Əgər əlavə sahə varsa, buraya əlavə edə bilərsən
}

export interface userDataInterface {
  _id?: string;
  fname?: string; // İstifadəçinin adı
  lname?: string; // İstifadəçinin soyadı
  bDate?: string;
  fathername?: string;
  position?: string;
  balance?: number;
  email?: string; // İstifadəçinin e-poçt adresi
  password?: string; // İstifadəçinin parolu
  role?: string; // İstifadəçinin rolu (məsələn, 'admin', 'operator', 'customer')
  identityNumber: string;
  status?: boolean;
  roleName?: string;
  address?: string;
  contracts?: Contract[];
  phoneNumber?:string;
  // address?: {
  //   street?: string;
  //   city?: string;
  //   state?: string;
  //   postCode?: string;
  //   category?: string;
  // };
  // dynamicFields?: {
  //   // Dinamik sahələr (adətən formdan gələn məlumatlar)
  //   [key: string]: any; // Dinamik olaraq hər hansı bir sahə əlavə edilə bilər
  // };
}

// Yeni istifadəçi yaratmaq üçün funksiya
export const createUser = async (userData: userDataInterface) => {
  const token = localStorage.getItem("token");

  try {
    // `POST` request ilə yeni istifadəçi əlavə edirik
    const response = await api.post(
      `${import.meta.env.VITE_API_URL}/users/create-user`,
      userData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data; // Serverdən gələn cavabı qaytarırıq
  } catch (error) {
    console.error("Error creating user:", error);
    throw error; // Xətanı yönəldirik
  }
};

// Bütün istifadəçiləri çəkmək üçün funksiya
export const getAllUsers = async (): Promise<userDataInterface[]> => {
  const token = localStorage.getItem("token");

  try {
    // `GET` request ilə bütün istifadəçiləri alırıq
    const response = await api.get(`${import.meta.env.VITE_API_URL}/users`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.users; // Serverdən gələn istifadəçiləri qaytarırıq
  } catch (error) {
    console.error("Error fetching all users:", error);
    throw error; // Xətanı yönəldirik
  }
};

// Rol ilə əlaqəli istifadəçiləri çəkmək (GET)
export const getUsersByRole = async (roleName: string) => {
  const token = localStorage.getItem("token");

  try {
    // `GET` request ilə rola aid istifadəçiləri alırıq
    const response = await api.get(
      `${import.meta.env.VITE_API_URL}/users/role/${roleName}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data.users; // Rolə aid istifadəçiləri qaytarırıq
  } catch (error) {
    console.error(`Error fetching users with role ${roleName}:`, error);
    throw error; // Xətanı yönəldirik
  }
};

// İstifadəçi məlumatını ID ilə çəkmək (GET)
export const getUser = async (userId: string) => {
  const token = localStorage.getItem("token");

  try {
    // `GET` request ilə istifadəçi məlumatlarını alırıq
    const response = await api.get(
      `${import.meta.env.VITE_API_URL}/users/${userId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data.user; // İstifadəçi məlumatını qaytarırıq
  } catch (error) {
    console.error(`Error fetching user with ID ${userId}:`, error);
    throw error; // Xətanı yönəldirik
  }
};
export const updateUser = async (
  userId: string,
  userData: userDataInterface
) => {
  const token = localStorage.getItem("token");

  try {
    const response = await api.post(
      `${import.meta.env.VITE_API_URL}/users/edit-user/${userId}`, // API ünvanı
      userData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data; // Yenilənmiş istifadəçi məlumatını qaytarırıq
  } catch (error) {
    console.error("Error updating user:", error);
    throw error; // Xətanı yönəldirik
  }
};

// İstifadəçi məlumatını silmək (DELETE)
export const deleteUser = async (userId: string) => {
  const token = localStorage.getItem("token");

  try {
    const response = await api.delete(
      `${import.meta.env.VITE_API_URL}/users/delete-user/${userId}`, // API ünvanı
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data; // Silinmiş istifadəçi məlumatını qaytarırıq
  } catch (error) {
    console.error("Error deleting user:", error);
    throw error; // Xətanı yönəldirik
  }
};
// İstifadəçinin yalnız ad və soyadını ID ilə çəkmək (GET)
export const getUserNameById = async (userId: string) => {
  const token = localStorage.getItem("token");

  try {
    const response = await api.get(
      `${import.meta.env.VITE_API_URL}/users/fullname/${userId}`, // Backend-də yazdığın yeni route
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    // Backend yalnız { success: true, user: { fname, lname } } qaytarır
    return response.data.user;
  } catch (error) {
    console.error(`Error fetching user name with ID ${userId}:`, error);
    throw error;
  }
};
export const getTechnicianUsers = async () => {
  const token = localStorage.getItem("token");

  const res = await api.get(
    `${import.meta.env.VITE_API_URL}/users/by-tech/technicians`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res.data.users; // yalnız user siyahısını geri qaytarırıq
};
