import {Schema, model, Document, ObjectId} from 'mongoose';

export interface FirewallDocument extends Document{
    firewallID: string,
    status: "active" | "inactive" 
}

interface Firewall {
    firewallID: string,
    status: "active" | "inactive" 
}

const firewallSchema = new Schema<Firewall>({
    firewallID: {
        type: String,
  },
  status:{
    type: String,
    enum: ["active", "inactive"]
  }
     
}, { timestamps: true })

const Firewall = model<Firewall>('firewall',firewallSchema);

export default FirewallDocument;