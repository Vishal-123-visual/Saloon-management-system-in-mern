import Services from "../models/serviceModel.js";


export const listServices = async (req,res)=>{
    // const {category,q}= req.query;
    // const filter = {active : true};
    // if(category) {
    //     filter.category = category;
    // }
    // if(q){
    //     filter.name = {$regex : q, $options : "i"};
    // }
    try {
      const items = await Services.find({active : true}).sort({name : 1}).populate('category', 'name');
      return res.status(200).json({
        success : true,
        data : items
      })
      
    } catch (error) {
      return res.status(500).json({
        message: "Internal Server Error",
        success: false,
      });
    }

}


export const getServicesByCategory = async (req, res)=>{
  try {
    const {categoryId} = req.params;

    const services = await Services.find({category : categoryId, active : true}).sort({serviceName: 1})
    if(!services){
      return res.status(404).json({
        message : "This category has no product!",
        success : false,
        error : true 
      })
    }

    return res.status(200).json({
      message : "Product by category",
      success : true,
      error : false,
      data : services
    })
    
  } catch (error) {
    return res.status(500).json({
      message : error.message || "Internal Server error",
      success : false,
      error : true
    })
  }
}


export const getServiceById = async (req, res) => {
  try {
    // console.log("id:", req.params.id);

    const service = await Services.findById(req.params.id).populate('category', 'name');

    if (!service) {
      return res.status(404).json({
        message: "Service not found",
        success: false,
      });
    }

    res.status(200).json({
      success: true,
      data: service,
    });
  } catch (error) {
    console.error("GetService Error:", error);
    res.status(500).json({
      message: error.message || "Internal Server Error",
      success: false,
    });
  }
};



export const createService = async(req,res)=>{
    try {
      // console.log("Full request body:", req.body);
      // console.log("File details:", req.file);
      // console.log("Headers:", req.headers);
      
      // Extract and validate all fields
      const {description, category, serviceName, price, discountPrice, duration} = req.body;
      
      // console.log("Extracted fields:", {
      //   description, category, serviceName, price, discountPrice, duration
      // });
        if(!description || !category || !serviceName || !price || !discountPrice || !duration){
            return res.status(400).json({
            message : "All Fields are required",
            success : false,
            error : true
          })
        }
        
        if(!req.file){
            return res.status(503).json({
                message : "image is required",
                success : false,
                error : true
            })
        }
        const imageUrl = req.file?.path;
        const s = await Services.create({description,category, serviceName,price,discountPrice,duration,imageUrl})
          return res.status(200).json({
            message : "service created",
            success : true,
            error : false,
            s
          })
        
    } catch (error) {
        return res.status(500).json({
        message :   error.message ,
        success : false,
        error : true
      })
    }
}



export const updateServices = async(req,res)=>{
    try {
        const data = {...req.body}
        //  console.log("Incoming update data:", req.body);
        //  console.log("Incoming file:", req.file);
        if(req.file?.path){
            data.imageUrl = req.file?.path;
        }
        const s = await Services.findByIdAndUpdate(req.params.id, data, {new : true})
        if(!s){
        return res.status(404).json({
        message : "service not found",
        success : false,
        error : true
      })
        }
        return res.json({
            message : "updated successfully",
            success : true,
            error : false,
            data : s
        })
    } catch (error) {
        return res.status(400).json({
        message : error.message ||  "internal server error",
        success : false,
        error : true
      })
    }
}




export const deleteService = async(req,res)=>{
    try {
        const s =  await Services.findByIdAndUpdate(req.params.id, {active : false}, {new : true})
        if(!s){
        return res.status(400).json({
        message : "service not found",
        success : false,
        error : true
      })
        }

        return res.json({message : "service deleted",success : true,error:false})
    } catch (error) {
        return res.status(400).json({
        message : "internal server error" || error.message,
        success : false,
        error : true
      })
    }
}