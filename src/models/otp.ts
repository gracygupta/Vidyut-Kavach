import {Schema, model, Document, ObjectId} from 'mongoose';

export interface OtpDocument extends Document{
    otp: number,
    empID: string,
    otpExpiresAt: Date
}

interface Otp {
    otp: number,
    empID: string,
    otpExpiresAt: Date
}

const otpSchema = new Schema<Otp>({
    otp: {
        type: Number,
        required: true
    },
    empID: {
        type: String,
        required: true
    },
    otpExpiresAt: {
        type: Date
    }
}, { timestamps: true })

const Otp = model<Otp>('otp',otpSchema);

export default Otp;