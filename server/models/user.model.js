import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required : [true, "Name is required"]
    },
    email:{
        type:String,
        required :[true, "Email is required"],
        unique:true,
        lowercase:true,
        trim:true
    },
    password:{
        type:String,
        required:[true, 'Password is required'],
        validate: {
            validator: function(v) {
                return /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(v);
            },
            message: props => `${props.value} is not a valid password! Password must be at least 8 characters long and include at least one letter and one number.`
        }
    },
});

export default mongoose.model('User', userSchema);