import { Document, model, Schema } from "mongoose";

export interface IUser extends Document {
    username: string,
    password: string
}

const userSchema = new Schema({
    username: { type: String, required: true, index: { unique: true } },
    password: { type: String, required: true },
    characters: [{ type: Schema.Types.ObjectId, ref: 'Characters' }]
})

export default model<IUser>('Users', userSchema)