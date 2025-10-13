// routes/serviceRoutes.js
import express from "express";
import { createService, deleteService, getServiceById, getServicesByCategory, listServices, updateServices } from "../controllers/serviceController.js";
import { protect, isAdminOrStaff } from "../middleware/authMiddleware.js";
import { allUser, deleteUser, getCurrentUser, getUserDetails, loginUser, logout, refreshTokenController, registerUser, updateUser } from "../controllers/userController.js";
import { uploadImage } from "../middleware/uploadMiddleware.js";
//import { cancelAppointment, createAppointment, getAllAppointment, getAppointmentById, updateAppointmentStatus } from "../controllers/appointmentController.js";
import { createPayment, getAllPayments, getPaymentById, getPaymentStats} from "../controllers/paymentController.js";
import { createCategory, deleteCategory,  getCategoryById, listCategories, updateCategory } from "../controllers/categoryController.js";
import { addItemToCart, clearCart, deleteItemToCart, getCartItems, updateCartItemQty } from "../controllers/cartController.js";
import { createCustomer, customerDetails, deleteCustomer, getAllCustomers, getCustomerByNameOrPhone, getCustomerVisitStats, updateCustomer } from "../controllers/customerController.js";
import { deleteAllSavedCarts, deleteSavedCart, getAllSavedCarts, getSavedCartById, saveCart, searchSavedCart } from "../controllers/saveCartController.js";





export const userRouter = express.Router()
export const serviceRouter = express.Router()
export const categoryRouter = express.Router()
export const addToCart = express.Router()
export const paymentRouter = express.Router()
export const customerRouter = express.Router()
export const saveCartRouter = express.Router()


// user routes
userRouter.post("/create", registerUser);
userRouter.post("/login", loginUser);
userRouter.get('/me',protect,getCurrentUser)
userRouter.get("/all",allUser)
userRouter.put("/:id",protect,isAdminOrStaff,updateUser)
userRouter.get("/:id",protect,isAdminOrStaff,getUserDetails)
userRouter.delete("/:id",protect,isAdminOrStaff,deleteUser)
userRouter.post('/refreshToken',refreshTokenController)
userRouter.post('/logout',protect,logout)

// customer routes 
customerRouter.post('/',protect,isAdminOrStaff,createCustomer)
customerRouter.get('/',protect,isAdminOrStaff,getAllCustomers)
customerRouter.get('/search',protect,isAdminOrStaff,getCustomerByNameOrPhone)
customerRouter.get('/customer-stats',protect,isAdminOrStaff,getCustomerVisitStats)
customerRouter.get('/:id',protect,isAdminOrStaff,customerDetails)
customerRouter.put('/:id',protect,isAdminOrStaff,updateCustomer)
customerRouter.delete('/:id',protect,isAdminOrStaff,deleteCustomer)


// category route
categoryRouter.post('/',protect,isAdminOrStaff,uploadImage.single('image'),createCategory)
categoryRouter.get('/',protect,listCategories)
categoryRouter.get('/:id',protect,isAdminOrStaff,getCategoryById)
categoryRouter.put('/:id',protect,isAdminOrStaff,uploadImage.single('image'),updateCategory)
categoryRouter.delete('/:id',protect,isAdminOrStaff,deleteCategory)

// service routes 
serviceRouter.get("/",  listServices);
serviceRouter.get("/:id", getServiceById);
serviceRouter.get("/category/:categoryId", getServicesByCategory);
serviceRouter.post("/", protect, isAdminOrStaff, uploadImage.single('image'), createService);
serviceRouter.put("/:id", protect, isAdminOrStaff,uploadImage.single('image'), updateServices);
serviceRouter.delete("/:id", protect, isAdminOrStaff, deleteService);

// add to cart route 
addToCart.post('/',protect,isAdminOrStaff,addItemToCart)
addToCart.get('/',protect,getCartItems)
addToCart.put('/',protect,isAdminOrStaff,updateCartItemQty)
addToCart.delete('/',protect,isAdminOrStaff,deleteItemToCart)
addToCart.delete('/many',protect,isAdminOrStaff,clearCart)

//save cart routes
saveCartRouter.post('/',protect,isAdminOrStaff,saveCart)
saveCartRouter.get('/',protect,isAdminOrStaff,getAllSavedCarts)
saveCartRouter.get('/:id',protect,isAdminOrStaff,getSavedCartById)
saveCartRouter.get('/search',protect,isAdminOrStaff,searchSavedCart)
saveCartRouter.delete('/:id',protect,isAdminOrStaff,deleteSavedCart)
saveCartRouter.delete('/',protect,isAdminOrStaff,deleteAllSavedCarts)


// // appointment routes
// appointmentRouter.post('/',createAppointment)
// appointmentRouter.get('/', protect, isAdminOrStaff, getAllAppointment)
// appointmentRouter.get('/:id',getAppointmentById)
// appointmentRouter.put('/:id/status',protect, isAdminOrStaff, updattatus)
// appointmentRouter.patch('/:id/cancel',protect, isAdminOrStaff, cancelAppointment)



/// payment routes

paymentRouter.post('/',protect,isAdminOrStaff,createPayment)
paymentRouter.get('/',protect,isAdminOrStaff,getAllPayments)
paymentRouter.get('/stats',protect,isAdminOrStaff,getPaymentStats)
paymentRouter.get('/:id',protect,isAdminOrStaff,getPaymentById)

