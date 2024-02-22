//Auth
//Test
// const posts = [
//     {
//         username: "manager@1"
//     }
// ]
// let refreshTokenArray = [];

// router.get('/posts', auth.authenticateToken, (req, res) => {
//     res.json(posts.filter(post => post.usernam == req.user.username))
// })

// router.post('/login', (req, res) => {
//     //Authenticate User
//     const username = req.body.username
//     const user = { name: username }
//     const accessToken = auth.generateAccessToken(user)
//     const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET)
//     refreshTokenArray.push(refreshToken)
//     res.json({ accessToken: accessToken, refreshToken: refreshTokenArray })
// })

// router.delete('/logout', (req, res) => {
//     refreshToken = refreshToken.filter(token => token !== req.body.token)
//     res.sendStatus(204)

// })

// router.post('/token', (req, res) => {
//     const refreshToken = req.body.token;
//     if (refreshToken == null) return res.sendStatus(401)
//     if (refreshToken.includes(refreshToken)) return res.sendStatus(403)
//     jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
//         if (err) return res.sendStatus(403)
//         const accessToken = atuh.generateAccessToken({ name: user.username })
//         res.json({ accessToken: accessToken })
//     })
// })
// Endpoint for user login