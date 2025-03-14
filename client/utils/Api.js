import axios from "axios";

const base = axios.create({
  baseURL: "http://localhost:5001/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

export const getAllPlaces = () => base.get("/generalUsers/places");
export const login = (data) => base.post("/authorities/login", data);
export const getAllSuperAdminData = () => base.get("/superadmin/allData");
export const deleteSpecificUser = (id) => base.delete(`/superAdmin/user/${id}`);
export const UpdateUserData = (id, data) => {
  base.patch(`/superadmin/user/${id}`, data);
};
export const addNewUser = (data) => base.post(`/superadmin/users`, data);
export const updatePlace = (data, id) => {
  base.post(`/superAdmin/places/${id}`, data);
};

export const addPlace = (data) => {
  base.post("/superAdmin/places/add/newPlace", data);
};

export const deletePlace = (id) => base.delete(`/superadmin/places/${id}`);

// Add this to your utils/Api.js file
export const uploadImage = (formData) => {
  return axios.post(`http://localhost:5001/api/v1/superadmin/places/image`, formData, {
    withCredentials: true,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
};
