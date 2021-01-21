import bcrypt from "bcrypt";
import { Document, HookNextFunction, model, Schema } from "mongoose";
import { ICharacter } from "./Character";

export interface IUser extends Document {
    userId: number,
    username: string,
    password: string,
    characters: [ICharacter],
    comparePassword(password): Promise<boolean>
}

const UserSchema = new Schema({
    userId: { type: Number },
    username: { type: String, required: true, index: { unique: true } },
    password: { type: String, required: true },
    characters: [{ type: Schema.Types.ObjectId, ref: 'Characters' }]
})



UserSchema.pre('save', async function (next: HookNextFunction) {
    const thisUser = this as IUser

    if (!this.isModified('password')) return next()

    try {
        const salt = await bcrypt.genSalt(10)
        thisUser.password = await bcrypt.hash(thisUser.password, salt)
        return next();
    }
    catch (error) {
        return next(error)
    }
})

UserSchema.methods.comparePassword = function (this: IUser, password: string) {
    return bcrypt.compare(password, this.password)
}


UserSchema.set('toJSON', {
    transform: (doc: any, ret: any) => {
        delete ret.password;
        return ret;
    }
})

const User = model<IUser>('Users', UserSchema)

export default User