import AsyncError from "../Errors/AsyncError.js";
import HttpError from "../Errors/HttpErros.js";
import user from "../Models/users.js";

export const getAllDistrictUser = AsyncError(async (req, res, next) => {
  const allUsers = await user
    .find({ role: "District User" })
    .select("-password");
  if (!allUsers) {
    return next(new HttpError(404, "No district User"));
  }
  return res.status(200).json({
    status: "Success",
    data: allUsers,
  });
});
