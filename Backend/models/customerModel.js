import mongoose from "mongoose";


const customerSchema = new mongoose.Schema(
    {
        name : { type : String, required : true, trim : true},
        email : { type : String, unique : true, trim : true},
        phone : { type : String, required : true, trim : true},
        country : { type : String, trim : true},
        state : { type : String, trim : true},
        city : { type : String, trim : true},
        street : { type : String, trim : true},
        postCode : { type : Number, trim : true},
        //refreshToken: { type: String },
      
    },
    { timestamps : true}
)


const Customer = mongoose.model('customer',customerSchema)

export default Customer