import AsyncError from "../Errors/AsyncError.js";
import HttpError from "../Errors/HttpErros.js";
import express from "express";
import user from "../Models/users.js";

export const getAllUsers = AsyncError(async (req, res, next) => {
  const loggedInuser = req.user;
  if (loggedInuser.role !== "admin") {
    return next(new HttpError(401, "No Acess"));
  }
  const allUsers = await user.find();
  return res.status(200).json({
    status: "success",
    data: allUsers,
  });
});
