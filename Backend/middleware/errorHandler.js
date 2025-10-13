export const notFound = (req,res,next)=>{
    res.status(404).json({
        message : ` Not Found - ${req.originalUrl}`
    })
}


export const errorHandler = (err,req,res,next)=>{
    const status = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;
    console.log(err)

    res.status(status).json({
        message : err.message || "Server error",
        ...err(process.env.NODE_ENV === "production" ? {} : {stack : err.stack})
    })
}