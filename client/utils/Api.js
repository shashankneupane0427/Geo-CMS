import axios from "axios";

const BACKEND_URI = import.meta.env.VITE_BACKEND_URI;
// console.log(BACKEND_URI);

const base = axios.create({
  baseURL: `${BACKEND_URI}/api/v1`,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

export const getAllPlaces = () => base.get("/generalUsers/places");
export const login = (data) => base.post("/authorities/login", data);
export const register = (data) => {
  return base.post("/authorities/register", data); 
};

export const getAllSuperAdminData = () => base.get("/superadmin/allData");
export const deleteSpecificUser = (id) => base.delete(`/superAdmin/user/${id}`);
export const UpdateUserData = (id, data) => {
  return base.patch(`/superadmin/user/${id}`, data); // Return the promise
};
export const addNewUser = (data) => base.post(`/superadmin/users`, data);
export const updatePlace = (data, id) => {
  return base.post(`/superAdmin/places/${id}`, data); // Return the promise
};

export const addPlace = (data) => {
  return base.post("/superAdmin/places/add/newPlace", data); // Return the promise
};

export const deletePlace = (id) => base.delete(`/superadmin/places/${id}`);

export const uploadImage = (formData) => {
  return axios.post(`${BACKEND_URI}/api/v1/superadmin/places/image`, formData, {
    withCredentials: true,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const getProvinceUserData = () => {
  return base.get("/provinceuser/allDistrictUsers");
};
