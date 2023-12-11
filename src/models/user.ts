import {Schema, model, Document, ObjectId} from 'mongoose';

export interface UserDocument extends Document{
    username: string,
    role: ObjectId,
    email: string,
    about: string | undefined,
    password: string
}

interface User {
    username: string,
    role: ObjectId,
    email: string,
    about: string | undefined,
    password: string
}

const userSchema = new Schema<User>({
    username:{
        type:String,
        unique: true,
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
        type: String
    },
    role: {
        type: Schema.Types.ObjectId,
        required: true
    },
    password: {
        type: String,
        required: true
    }
})

const User = model<User>('user',userSchema);

export default User;