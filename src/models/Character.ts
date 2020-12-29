import { Document, model, Schema } from "mongoose";

export interface ICharacter extends Document {
    name: string
    level: number
    characterClass: string
    account: string
}

const CharacterSchema = new Schema({
    name: { type: String, required: true },
    level: { type: Number, required: true, default: 1 },
    characterClass: { type: String, required: true },
    account: { type: Schema.Types.ObjectId, ref: 'User' }
})

export default model<ICharacter>('Characters', CharacterSchema);