import * as commontags from 'common-tags';
import { Router } from "express";
import { sign } from 'jsonwebtoken';
import { auth, secret } from "../../config/passport";
import User, { IUser } from "../../models/User";

const router = Router()

router.get('/', auth, (req, res) => {
    User.find({}, (err, users) => {
        if (err) {
            return res.status(500).send({ err });
        }
        return res.send(users);
    });
});

router.get('/:id(\d+)', auth, async (req, res) => {
    const { id } = req.params
    try {
        const user = await User.findById(id)
        return res.send(user)
    } catch (err) {
        return res.status(400).send({ err })
    }
})

router.get('/:username', async (req, res) => {
    console.log('meow')
    const { username } = req.body
    if (!username) return res.status(400).send({ error: 'Required fields not found: username' })
    try {
        const user = await User.findOne({ username: username })
        return res.send(user)
    } catch (err) {
        return res.status(400).send({ err })
    }
})

router.post('/token', (req, res) => {
    const { username, password } = req.body
    const fieldsNotFound = checkForFields(username, password)

    if (fieldsNotFound)
        return res.status(400).send({
            err: commontags.commaListsAnd`
Required fields not found: ${fieldsNotFound}`
        });

    User.findOne({ username: username }, async (err: string, user: IUser) => {
        if (err) return res.status(400).send(err)
        if (!user) return res.status(400).send({ error: `Cannot find user "${username}"` })
        const passCheck = await user.comparePassword(password)

        if (!passCheck)
            return res.status(401).send({ err: 'Invalid Password' })

        const payload = { id: user._id }
        const token = sign(payload, secret)
        console.log(payload)
        return res.send(token)
    })
})

router.post('/', (req, res) => {
    const { username, password } = req.body;

    const fieldsNotFound = checkForFields(username, password)

    if (fieldsNotFound) res.status(400).send({
        err: commontags.commaListsAnd`
    Required fields not found: ${fieldsNotFound}`
    });

    const newUser = new User({
        username: username,
        password: password
    });

    newUser.save((err, model) => {
        if (err) {
            return res.status(400).send({ err });
        }

        return res.status(201).send(model);
    });
});

router.get('/current', auth, (req, res) => {
    return res.send(req.user);
});


export default router;

function checkForFields(username: string, password: string) {
    if (!username || !password) {
        const fieldsNotFound: string[] = [];

        if (!username) fieldsNotFound.push('username');
        if (!password) fieldsNotFound.push('password');

        return fieldsNotFound
    }

    return undefined
}
