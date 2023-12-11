import {Schema, model, Document, ObjectId} from 'mongoose';

export interface PrivilegeDocument extends Document{
    name: string,
    description: string | undefined
}

interface Privilege {
    name: string,
    description: string | undefined
}

const privilegeSchema = new Schema<Privilege>({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String
    }
},{ timestamps: true })

const Privilege = model<Privilege>('privileges', privilegeSchema);

export default Privilege;