import {Schema, model, Document, ObjectId} from 'mongoose';

export interface RoleDocument extends Document{
    name: string,
    description: string | undefined,
    privileges: ObjectId[]
}

interface Role {
    name: string,
    description: string | undefined
    privileges: ObjectId[];
}

const roleSchema = new Schema<Role>({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    privileges: [
        {
          type: Schema.Types.ObjectId,
          ref: 'privileges',
        },
      ]
}, { timestamps: true })

const Role = model<Role>('role',roleSchema);

export default Role;