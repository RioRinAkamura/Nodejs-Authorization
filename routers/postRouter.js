const express = require('express')
const router = express.Router()
const verifyToken = require('../middleware/auth')
const { posts } = require('../data')
require("dotenv").config();

router.get('/', verifyToken, (req, res) => {
    const post = posts.filter(post => post.userId === req.userId)
    res.json(post)

})

module.exports = router