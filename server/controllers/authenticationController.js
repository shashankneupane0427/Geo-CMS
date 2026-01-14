import AsyncError from "../Errors/AsyncError.js";
import user from "../Models/users.js";
import jwt from "jsonwebtoken";
import HttpError from "../Errors/HttpErros.js";

export const login = AsyncError(async (req, res, next) => {
  const userDetail = await user.findOne({ email: req.body.email });
  if (!userDetail) {
    return next(new HttpError(404, "Could not find user with the provided credentials"));
  }

  if (userDetail.password !== req.body.password) {
    return next(new HttpError(401, "Incorrect Password"));
  }

  const token = jwt.sign(
    { role: userDetail.role, id: userDetail._id },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  res.cookie("authToken", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 24 * 60 * 60 * 1000,
  });

  const userResponse = {
    _id: userDetail._id,
    email: userDetail.email,
    role: userDetail.role,
    district: userDetail.district,
    province: userDetail.province,
  };

  res.status(200).json({
    message: "Logged in successfully",
    user: userResponse,
  });
});

export const protect = AsyncError(async (req, res, next) => {
  const token = req.cookies.authToken;
  if (!token) {
    return next(new HttpError(401, "No token provided"));
  }

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    return next(new HttpError(401, "Invalid or expired token"));
  }

  req.user = decoded;
  next();
});

export const register = AsyncError(async (req, res, next) => {
  const { email, password, role, province, district } = req.body;

  const existingUser = await user.findOne({ email });
  if (existingUser) {
    return next(new HttpError(400, "User with this email already exists"));
  }

  const newUser = await user.create({
    email,
    password, // plain-text
    role,
    province: role === "province" ? province : undefined,
    district: role === "district" ? district : undefined,
  });

  const token = jwt.sign(
    { id: newUser._id, role: newUser.role },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  res.cookie("authToken", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 24 * 60 * 60 * 1000,
  });

  res.status(201).json({
    message: "Registration successful",
    user: {
      _id: newUser._id,
      email: newUser.email,
      role: newUser.role,
      province: newUser.province,
      district: newUser.district,
    },
  });
});

export const logout = AsyncError(async (req, res, next) => {
  res.clearCookie("authToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
  });
  res.status(200).json({ message: "Logged out successfully" });
});
