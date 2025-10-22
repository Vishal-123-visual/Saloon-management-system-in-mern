import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import connectedToDB from './config/db.js'
import { addToCart, categoryRouter, customerRouter, paymentRouter, saveCartRouter, serviceRouter, userRouter } from './routes/Route.js'
import cookieParser from 'cookie-parser'

dotenv.config()
const Port = process.env.PORT || 5000

const app = express()

app.use(cookieParser())
// ✅ Enable CORS
app.use(cors({
  origin : process.env.FRONTEND_URL || "*",
  methods : ['GET','POST','PUT','DELETE'],
  credentials : true
}))

// Global middleware for parsing requests
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Route middlewares
app.use('/api/v1/salon/category', categoryRouter)
app.use('/api/v1/salon/service', serviceRouter)
app.use('/api/v1/salon/user', userRouter)
app.use('/api/v1/salon/customer', customerRouter)
app.use('/api/v1/salon/cart', addToCart)
app.use('/api/v1/salon/payment', paymentRouter)
app.use('/api/v1/salon/save-cart', saveCartRouter)



// ✅ Connect to DB
connectedToDB()

// ✅ Test route
app.get('/', (req, res) => {
  res.send('Hello World!')
})

// ✅ Start server
app.listen(Port, () => {
  console.log(`Server is running on port: ${Port}`)
})
