import {Schema, model, Document, ObjectId} from 'mongoose';

export interface UserDocument extends Document{
    empID : string,
    username: string,
    role: ObjectId,
    email: string,
    about: string | undefined,
    password: string
}

interface User {
    empID : string,
    username: string,
    role: ObjectId,
    email: string,
    about: string | undefined,
    password: string
}

const userSchema = new Schema<User>({
    empID : {
        type: String,
        unique: true,
        required:true
    },
    username:{
        type:String,
        required: true
    },
    email:{
        type: String,
        required:true,
        unique: true,
        validate: {
            validator: (value: string) => {
              const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
              return emailRegex.test(value);
            },
            message: (props) => `${props.value} is not a valid email address`,
          },
    },
    about: {
        type: String,
        default: ""
    },
    role: {
        type: Schema.Types.ObjectId,
        required: true
    },
    password: {
        type: String,
        required: true
    }
}, {timestamps: true})

const User = model<User>('user',userSchema);

export default User;