import { Router } from "express";
import User from "../../models/User";
import * as commontags from 'common-tags'

const router = Router()

router.get('/', (req, res) => {
    User.find({}, (err, users) => {
        if (err) {
            return res.status(500).send({ err });
        }
        return res.send(users);
    });
});

router.get('/:id', (req, res) => {
    const { id } = req.params
    User.findById(id, function (err, userModel) {
        if (err) return res.status(400).send({ err })
        return res.send(userModel)
    })
})

router.post('/', (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        const fieldsNotFound = [];
        if (!username) fieldsNotFound.push('username');
        if (!password) fieldsNotFound.push('password');

        return res.status(400).send({
            err: commontags.commaListsAnd`
        Required fields not found: ${fieldsNotFound}`
        });
    }

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

export default router;
