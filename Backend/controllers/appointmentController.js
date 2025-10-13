import Appointment from "../models/appointmentModel.js";
import Services from "../models/serviceModel.js";
import User from "../models/userModel.js";


export const createAppointment = async(req,res)=>{
    try {
        const{customer, serviceId, staffId, start, end, servicePrice} = req.body;
        if(!customer?.name || !customer?.phone){
            return res.status(400).json({
                message : "Customer name and phone are required",
                success :  false,
                error : true
            })
        }
        if(!serviceId || !staffId || !start || !end || !servicePrice){
            return res.status(400).json({
                message : "All fields are required",
                success :  false,
                error : true
            })
        }

        const service = await Services.findById(serviceId);
        if(!service){
            return res.status(404).json({
                message : "Service not found",
                success :  false,
                error : true
            })
        }
        const staff = await User.findById(staffId);
        if(!staff){
            return res.status(404).json({
                message : "Staff not found",
                success :  false,
                error : true
            })
        }
        const apponitment = await Appointment.create({
            customer,serviceId,staffId,start,end,servicePrice
        })
        return res.status(200).json({
                message : "Appointment created",
                success :  true,
                error : false,
                data : apponitment
            })
    } catch (error) {
        return res.status(500).json({
            message : error.message,
            success : false,
            error : true
        })
    }
}

export const getAllAppointment = async(req,res)=>{
    try {
        const query = {};
        if(req.user.role === 'staff'){
            query.staffId = req.user._id
        }
        if(req.query.status){
            query.status = req.query.status;  // booked/completed
        }
        if(req.query.search){
            query["customer.name", " customer.phone"] = {$regex:req.query.search,$options : "i"};
        }
        const appointments = await Appointment.find(query).populate("serviceId", "name price").populate("staffId", "name phone")
        return res.status(200).json({
                message : "all appointments",
                success :  true,
                error : false,
                data : appointments
            })
    } catch (error) {
        return res.status(500).json({
                message : error.message,
                success :  false,
                error : true
            })
    }
}


export const getAppointmentById = async(req,res)=>{
    try {
        const appointment = await Appointment.findById(req.params.id).populate("serviceId", "name price").populate("staffId", "name price")
        if(!appointment){
            return res.status(404).json({
                message : "appointment not found",
                success :  false,
                error : true
            })
        }
        return res.status(200).json({
                message : "appointment",
                success :  true,
                error : false,
                data : appointment
            })
    } catch (error) {
        return res.status(500).json({
                message : error.message,
                success :  false,
                error : true
            })
    }
}


export const updateAppointmentStatus = async( req,res)=>{
    try {
    const {id} = req.params;
    const {status} = req.body;
        const updated = await Appointment.findByIdAndUpdate(id, {status}, {new : true})
        if(!updated){
            return res.status(404).json({
                message : "Appointment not found",
                success :  false,
                error : true
            })
        }
        return res.status(200).json({
                message : "Appointment status updated",
                success :  true,
                error : false,
                data : updated
            })
    } catch (error) {
        return res.status(500).json({
                message : error.message,
                success :  false,
                error : true
            })
    }
}


export const cancelAppointment = async( req,res)=>{
    try {
        const canceled = await Appointment.findByIdAndUpdate(req.params.id, {status : "canceled"}, {new : true})
        if(!canceled){
            return res.status(404).json({
                message : "Appointment not found",
                success :  false,
                error : true
            })
        }
        return res.status(200).json({
                message : "Appointment canceled",
                success :  true,
                error : false,
                data : canceled
            })
    } catch (error) {
        return res.status(500).json({
                message : error.message,
                success :  false,
                error : true
            })
    }
}