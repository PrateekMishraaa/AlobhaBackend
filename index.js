import express from "express"
const app = express()
import dotenv from "dotenv"
dotenv.config()
const PORT = process.env.PORT || 4000
import mongooose from "mongoose"
import cors from "cors"
import morgan from "morgan"
import User from "./routes/UserRoute.js"
import Form from "./routes/UserForm.js"

app.use(express.json())
app.use(morgan())
app.use(cors())
app.use("/uploads", express.static("uploads"))
app.use('/api',User)
app.use('/api',Form)
app.use('/',(req,res)=>{
  console.log('prateek')
  res.send('world')
})
mongooose.connect(process.env.MONGOURI)
.then(()=>{
  console.log('Database connected with server')
}).catch((error)=>{
  console.log('Disconnected with server',error)
})


app.listen(PORT,()=>console.log(`server start at ${PORT}`))