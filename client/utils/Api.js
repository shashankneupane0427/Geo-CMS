import axios from "axios";

const base = axios.create({
  baseURL: "http://localhost:5001/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
});

export const getAllPlaces = () => base.get("/generalUsers/places");
export const login = (data) => base.post("/authorities/login", data);
