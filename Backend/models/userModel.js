import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, unique: true, lowercase: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["admin", "staff", "customer"],
      default:"customer",
      require : true
    },
    phone: { type: String,required : true, trim : true },
    loyaltyPoints: { type: Number, default: 0 },

      // Tokens
  accessToken: { type: String },   // optional, store if needed
  refreshToken: { type: String },  // refresh token must be stored if you want persistent login

  },
  { timestamps: true }
);
const User = mongoose.model('user',userSchema)
export default User
