// import mongoose
import mongoose from "mongoose";

// Image Schema
const ImageSchema = new mongoose.Schema({
    url: {
        type: String,
        required: true
    },
}, { timestamps: true });

// create image model
const Image = mongoose.model("Image", ImageSchema);

export default Image;