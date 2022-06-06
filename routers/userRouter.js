const express = require('express')
const router = express.Router()
let { users } = require('../data')
const jwt = require('jsonwebtoken')
const verifyToken = require('../middleware/auth')

const generateToken = payload => {
    const { id, username } = payload
    // Create JWT

    const accessToken = jwt.sign({ id, username }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: '5m'
    })

    const refreshToken = jwt.sign({ id, username }, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: '1h'
    })

    return { accessToken, refreshToken }
}

const updateRefreshToken = (username, refreshToken) => {

    users = users.map(user => {
        if (user.username === username)
            return {
                ...user,
                refreshToken
            }
        return user
    })
    console.log(users);

}

router.post('/login', (req, res) => {
    const username = req.body.username
    const user = users.find(user => user.username === username)

    if (!user) return res.sendStatus(401)

    const tokens = generateToken(user)
    updateRefreshToken(username, tokens.refreshToken)

    res.status(200).json({ tokens })
})

router.post('/token', (req, res) => {
    const refreshToken = req.body.refreshToken
    if (!refreshToken) return res.sendStatus(401)

    const user = users.find(user => user.refreshToken === refreshToken)
    if (!user) return res.sendStatus(403)

    try {
        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET)

        const tokens = generateToken(user)
        updateRefreshToken(user.username, tokens.refreshToken)

        res.json(tokens)

    } catch (error) {
        console.log(error)
        res.sendStatus(403)
    }
})

router.delete('/logout', verifyToken, (req, res) => {
    const user = users.find(user => user.id === req.userId)
    updateRefreshToken(user.username, null)
    console.log(users);
    res.json(user)
})



module.exports = router