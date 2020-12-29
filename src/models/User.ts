import bcrypt from "bcrypt";
import { Document, HookNextFunction, model, Schema } from "mongoose";

export interface IUser extends Document {
    username: string,
    password: string,
    comparePassword(password): Promise<boolean>
}

const User = new Schema({
    username: { type: String, required: true, index: { unique: true } },
    password: { type: String, required: true },
    characters: [{ type: Schema.Types.ObjectId, ref: 'Characters' }]
})



User.pre('save', async function (next: HookNextFunction) {
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

User.methods.comparePassword = function (this: IUser, password: string) {
    return bcrypt.compare(password, this.password)
}


User.set('toJSON', {
    transform: (doc: any, ret: any) => {
        delete ret.password;
        return ret;
    }
})


export default model<IUser>('Users', User)