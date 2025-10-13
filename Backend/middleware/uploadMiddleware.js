import multer from 'multer'
import {CloudinaryStorage} from 'multer-storage-cloudinary'
import cloudinary from '../config/cloudinary.js'

const serviceStorage = new CloudinaryStorage({
    cloudinary,
    params : {
        folder : "salon/services",
        allowed_formats : ["jpg","jpeg","png","webp"],
        transformation : [{quality : "auto",fetch_format : "auto"}]
    }
})

const avatarStorage = new CloudinaryStorage({
    cloudinary,
    params : {
        folder : "salon/avatars",
        allowed_formats : ["jpg","jpeg","png","webp"],
        transformation : [{quality : "auto",fetch_format : "auto"}]
    }
})


export const uploadImage = multer({storage : serviceStorage})

export const uploadAvatar = multer({storage : avatarStorage})