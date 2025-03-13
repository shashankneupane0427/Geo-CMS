import mongoose, { mongo } from "mongoose";

const placeModel = new mongoose.Schema({
  images: {
    type: [String],
  },
  title: {
    type: String,
    required: true,
  },
  location: {
    latitude: {
      type: String,
      required: true,
    },
    longitude: {
      type: String,
      required: true,
    },
  },
  district: {
    type: String,
    required: true,
  },
  province: {
    type: String,
    required: true,
  },
  description: String,
});

const place = mongoose.model("places", placeModel);

export default place;
