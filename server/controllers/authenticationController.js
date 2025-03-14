import AsyncError from "../Errors/AsyncError.js";
import user from "../Models/users.js";
import jwt from "jsonwebtoken";
import HttpError from "../Errors/HttpErros.js";

export const login = AsyncError(async (req, res, next) => {
  const userDetail = await user.findOne({ email: req.body.email });
  if (!userDetail) {
    return next(
      new HttpError(404, "couldnot find the user of the credintials provided")
    );
  }
  if (userDetail.password !== req.body.password) {
    return next(new HttpError(401, "Incorrect Password"));
  }
  const token = jwt.sign(
    { role: userDetail.role, id: userDetail._id },
    process.env.JWT_SECRET
  );

  res.cookie("authToken", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });
  const userResponse = {
    _id: userDetail._id,
    email: userDetail.email,
    role: userDetail.role,
    district: userDetail.district,
    province: userDetail.province,
  };

  return res.status(200).json({
    message: "Logged in successfully",
    user: userResponse,
  });
});

export const protect = AsyncError(async (req, res, next) => {
  const token = req.cookies.authToken;
  //(token);
  if (!token) {
    return next(new HttpError(401, "No token provided"));
  }

  const decode = jwt.verify(token, process.env.JWT_SECRET);
  if (!decode) {
    return next(new HttpError(401, "Unauthorized"));
  }
  req.user = decode;
  next();
});
