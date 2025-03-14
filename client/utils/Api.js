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
