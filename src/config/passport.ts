import passport from 'passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import path from 'path'
import User from '../models/User'

const dotenvPath = path.join(__dirname, '..', '..', '.env')

require('dotenv').config({ path: dotenvPath })

const secret: string = process.env.SECRET_OR_KEY || ''

const options = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: secret
}

const strategy = new Strategy(options, function (payload, next) {
    User.findById(payload.id, function (err: any, result: any) {
        if (err) return next(err)
        return next(null, result)
    })
})

passport.use(strategy)

export default passport
export { secret }
export const auth = passport.authenticate('jwt', { session: false })