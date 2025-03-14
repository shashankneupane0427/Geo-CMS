import AsyncError from "../Errors/AsyncError.js";
import HttpError from "../Errors/HttpErros.js";
import express from "express";
import user from "../Models/users.js";
import place from "../Models/places.js";

// export const getAllUsers = AsyncError(async (req, res, next) => {
//   const allUsers = await user.find().select("-password");
//   return res.status(200).json({
//     status: "success",
//     data: allUsers,
//   });
// });

export const getAllData = AsyncError(async (req, res, next) => {
  const loggedInuser = req.user;
  console.log(loggedInuser);
  if (loggedInuser.role !== "admin") {
    return next(new HttpError(401, "No Access"));
  }
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

export const deleteUserData = AsyncError(async (req, res, next) => {
  const id = req.params.id;
  const userExists = await user.findByIdAndDelete(id);
  if (!userExists) {
    return next(new HttpError(404, "Didnot found user of the Id provided"));
  }
  return res.status(200).json({
    status: "success",
    message: "User deleted Successfully",
  });
});

export const updateUserData = AsyncError(async (req, res, next) => {
  const id = req.params.id;
  let userExists = await user.findById(id);
  if (!userExists) {
    return next(new HttpError(404, "Didnot found user of the Id provided"));
  }
  Object.assign(userExists, req.body);
  await userExists.save();

  return res.status(200).json({
    status: "success",
    data: userExists,
  });
});

export const addNewUser = AsyncError(async (req, res, next) => {
  console.log(req.body);
  const newUser = await user.create(req.body);
  if (!newUser) {
    return next(new HttpError(500, "cannot create a new user"));
  }
  return res.status(200).json({
    status: "success",
    data: newUser,
  });
});

export const deletePlace = AsyncError(async (req, res, next) => {
  const placeExists = await place.findByIdAndDelete(req.params.id);
  if (!placeExists) {
    return next(
      new HttpError(404, "The place of the id provided was not found")
    );
  }
  return res.status(200).json({
    status: "success",
    message: "Deleted Successfully",
  });
});
