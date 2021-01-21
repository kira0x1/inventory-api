import commonTags from "common-tags";
import { Router } from "express";
import { auth } from "../../config/passport";
import Character from "../../models/Character";
import User, { IUser } from "../../models/User";

const router = Router()

router.get('/', (req, res) => {
    Character.find({}, (err, chars) => {
        if (err) return res.status(500).send({ err })

        return res.send(chars)
    })
})

router.post('/', auth, function (req: any, res) {
    const { name, level, characterClass } = req.body;

    const fieldsNotFound = checkForFields(name, level, characterClass);

    if (fieldsNotFound)
        res.status(400).send({
            err: commonTags.commaListsAnd`
Required fields not found: ${fieldsNotFound}`
        });

    const newCharacter = new Character({
        name: name,
        level: level,
        characterClass: characterClass,
        account: req.user._id
    });

    newCharacter.save(async (err, savedCharacter) => {
        if (err) return res.status(400).send({ err })
        await User.findByIdAndUpdate(req.user._id, { $push: { characters: savedCharacter._id } })
        return res.send(savedCharacter)
    })
})

router.get('/user', async (req, res) => {
    const { username } = req.params
    try {
        const user: IUser = await User.find({ username: username })
        return res.send(user.characters)
    } catch (error) {
        return res.status(400).send(error)
    }
})

export default router

function checkForFields(name, level, characterClass) {
    if (!name || !level || !characterClass) {
        const fieldsNotFound: string[] = [];

        if (!name) fieldsNotFound.push('name');
        if (!level) fieldsNotFound.push('level');
        if (!characterClass) fieldsNotFound.push('characterClass');

        return fieldsNotFound
    }
    return undefined
}