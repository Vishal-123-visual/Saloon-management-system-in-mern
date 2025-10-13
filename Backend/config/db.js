import mongoose from "mongoose";


const connectedToDB =  async ()=>{
    try {
         await mongoose.connect(process.env.MONGODB_URI, {
        autoIndex: false, // production: disable autoIndex for perf; create indexes in code
        serverSelectionTimeoutMS : 5000,
        socketTimeoutMS : 45000,
        maxPoolSize : 50,
        minPoolSize : 5,
        family : 4
    })
    console.log(`MongoDB connected`);
    } catch (error) {
        console.log('mongodb not connected',error.message)
        process.exit(1);
    }
}


export default connectedToDB