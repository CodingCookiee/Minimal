import express from 'express'
import cookieParser from 'cookie-parser'
import dotenv from 'dotenv'
import { connectToDatabase } from './config/database.js'
import  errorHandler  from './middleware/errorHandler.middleware.js'
import routes from './routes/index.js'
import cors from 'cors'

dotenv.config()
const port = parseInt(process.env.PORT || 3000)

const app = express()
app.use(express.json())
app.use(cookieParser())
app.use(errorHandler)
app.use(cors({
    origin: `process.env.CLIENT_URL`,
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
    crossOriginOpenerPolicy: true,

}))


app.use('/auth', routes.authRoutes)
app.use('/user', routes.userRoutes)
app.use('/product', routes.productRoutes)
app.use('/coupon', routes.couponRoutes)
app.use('/cart', routes.cartRoutes)
app.use('/payment', routes.paymentRoutes)
app.use('/analytics', routes.analyticsRoutes)
app.get('/', (req, res) =>{
 res.send('Server is running : Use /api to run tests')
})



app.listen(process.env.PORT, async () => {
    await connectToDatabase()
    console.log(`Server is running on port ${process.env.PORT}`)
    console.log(`Client allowed: ${process.env.CLIENT_URL}`)
}).on('error', (err) => {
    if(error.code === 'EADDRINUSE') {
        console.log('Port is already in use')
    } else {
        console.log('Server Error:' ,err)
    }
})