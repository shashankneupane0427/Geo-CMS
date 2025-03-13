import AsyncError from "../Errors/AsyncError.js";
import HttpError from "../Errors/HttpErros.js";
import express from "express";
import user from "../Models/users.js";
import place from "../Models/places.js";

export const getAllUsers = AsyncError(async (req, res, next) => {
  const loggedInuser = req.user;
  if (loggedInuser.role !== "admin") {
    return next(new HttpError(401, "No Acess"));
  }
  const allUsers = await user.find().select("-password");
  return res.status(200).json({
    status: "success",
    data: allUsers,
  });
});

export const getAllData = AsyncError(async (req, res, next) => {
  const places = await place.find();
  const users = await user.find();
  return res.status(200).json({
    status: "sucess",
    data: {
      places,
      users,
    },
  });
});
