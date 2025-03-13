import AsyncError from "../Errors/AsyncError.js";
import place from "../Models/places.js";

export const getAllPlaces = AsyncError(async (req, res, next) => {
  const places = await place.find();
  return res.status(200).json({
    status: "Success",
    data: places,
  });
});
