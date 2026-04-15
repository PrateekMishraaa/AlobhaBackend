import mongoose,{Schema} from "mongoose";
import bcrypt from "bcryptjs"
const UserSchema = new Schema({
    FullName:{
        type:String,
        required:[true,'Full name is required']
    },
    Gender:{
        type:String,
        required:[true,'Gender is required'],
        enum:['male','female','other'],
        default:''
    },
    ContactNumber:{
        type:String,
        required:[true,'Contact is required'],
        unique:[true,"Contact number already have an account"]
    },
    Email:{
        type:String,
        required:[true,'Email is required'],
        unique:[true,'Email is already used']
    },
    Address:{
        type:String
    },
    Password:{
        type:String,
        required:[true,'Password is required'],
        minlength:[8,'Password must be atleast 8 character'],
        maxlength:[255,'Password should not be more than 255 character']
    }
},{
    timestamps:true
})
UserSchema.pre('save',async function(){
    if(!this.isModified('Password')){
        return 
    }
    const salt = await bcrypt.genSalt(10)
    this.Password = await bcrypt.hash(this.Password,salt)
    return 

})
const Users = mongoose.model('Users',UserSchema)
export default Users