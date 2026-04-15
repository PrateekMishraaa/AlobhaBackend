import express from "express"
const router = express.Router()
import Users from "../models/UserSchema.js"
import bcrypt from "bcryptjs"
import JWT from "jsonwebtoken"
router.post('/register',async(req,res)=>{
    const {FullName,Gender,ContactNumber,Email,Address,Password} = req.body;
    if(!FullName || !Gender || !ContactNumber || !Email || !Address || !Password){
        return res.status(400).json({message:"All fields are required"})
    }
    if(ContactNumber.length!=10){
        return res.status(400).json({message:"Contact Number should be in 10 digits"})
    }
    try{
        const isUserExist = await Users.findOne({Email})
        if(isUserExist){
            return res.status(300).json({message:"User Already Exist with this Email | Please Use Different Email"})
        }
        const NewUser = await Users.create({
            FullName,
            Email,
            ContactNumber,
            Gender,
            Address,
            Password
        })
        console.log('User Created',NewUser)
        return res.status(200).json({message:"User Created Successfully",user:NewUser})
    }catch(error){
        console.log('error',error)
        return res.status(500).json({message:"Internal server error",error})
    }
})

router.post('/login',async(req,res)=>{
    const {Email,Password} = req.body;
    if(!Email || !Password){
        return res.status(400).json({message:"Invalid credentials"})
    }
    try{
        const isUser = await Users.findOne({Email})
        if(!isUser){
            return res.status(404).json({message:"User not found with this email | Please register first"})
        }
        const isMatch = await bcrypt.compare(Password,isUser.Password)
        if(!isMatch){
            return res.status(400).json({message:"Incorrect Password"})
        }
        const payload = {
            id:isUser.id,
            name:isUser.FullName,
            email:isUser.Email,
            contact:isUser.ContactNumber,
            gender:isUser.Gender,
            address:isUser.Address
        }
        const token = await JWT.sign(payload,process.env.JWTSECRET,{expiresIn:'2d'})
        console.log('token',payload,token)
        if(!token){
            return res.status(400).json({message:"Something went wrong while user login ! Please try again later"})
        }
        return res.status(200).json({message:"User Login successfully",token,payload})
    }catch(error){
        console.log('error',error)
        return res.status(500).json({message:"Internal server error",error})
    }
})

export default router