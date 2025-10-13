import mongoose, { Schema } from "mongoose";

const categorySchema = new mongoose.Schema({
    name : {
        type : String,
        required : true,
        uinque : true,
        default : ""
    },
    image : {
        type : String,
        required : true,
        trim : true,
        default : ""
    },
    active: {
      type: Boolean,
      default: true,
    },
},{timestamps : true})

const categoryModel = mongoose.model('category',categorySchema)

export default categoryModel