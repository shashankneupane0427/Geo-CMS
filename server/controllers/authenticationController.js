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
  return res.status(200).json({
    message: "Logged in successfully",
    token,
  });
});
