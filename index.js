const express = require('express')
const app = express()
const dotenv = require('dotenv')
const userRouter = require('./routers/userRouter')
const postRouter = require('./routers/postRouter')

dotenv.config()
const PORT = process.env.PORT || 3000
app.use(express.json())

// app.get('/', (req, res) => {
//     res.send('Home page')
// })

app.use('/', userRouter)
app.use('/posts', postRouter)

app.listen(PORT, () => {
    console.log(`server is running at port ${PORT}`);
})