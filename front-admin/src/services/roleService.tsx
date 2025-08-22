import axios from "axios";

// Типы для ролей (role)
export interface Field {
  name: string;
  type: string;
  required: boolean;
  key: string;
}

export interface roleDataInterface {
  _id: string;
  [x: string]: {};
  key: string;
  name: string;
  showName: string;
  // description: string;
  fields: Field[]; // Dinamik sahələr (fields) də əlavə edilir
}

// Yeni rol yaratmaq
export const createRole = async (roleData: roleDataInterface) => {
  // Axios ilə API-ya sorğu göndəririk
  return axios
    .post(`${import.meta.env.VITE_API_URL}/roles/create-role`, roleData)
    .then((res) => res.data);
};

// Bütün rolları gətirmək
export const getAllRoles = async (): Promise<roleDataInterface[]> => {
  return axios
    .get(`${import.meta.env.VITE_API_URL}/roles`)
    .then((res) => res.data);
};

// Tek bir role-u id ilə gətirmək
export const getRoleById = async (id: string): Promise<roleDataInterface> => {
  return axios
    .get(`${import.meta.env.VITE_API_URL}/api/roles/${id}`)
    .then((res) => res.data);
};

// Tek bir role-u name ilə gətirmək
export const getRoleByName = async (
  name: string
): Promise<roleDataInterface> => {
  return axios
    .get(`${import.meta.env.VITE_API_URL}/api/roles/name/${name}`)
    .then((res) => res.data);
};
// Mövcud rolu yeniləmək
export const updateRole = async (
  id: string,
  updatedData: roleDataInterface
): Promise<roleDataInterface> => {
  return axios
    .put(`${import.meta.env.VITE_API_URL}/api/roles/edit-role/${id}`, updatedData)
    .then((res) => res.data);
};
