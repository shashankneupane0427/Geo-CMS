import axios from "axios";

const baseUrl = axios.create({
  baseURL: "http://localhost:5001/api/v1/",
  headers: {
    "Content-Type": "application/json",
  },
});

export const getAllPlaces = () => baseUrl.get("/generalUsers/places");
