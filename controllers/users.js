const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

const formatUser = (user) => {
  return {
    id: user.id,
    username: user.username,
    name: user.name,
    adult: user.adult,
    blogs: user.blogs
  }
}

usersRouter.get('/', async (request, response) => {
  const users = await User.find({}).populate('blogs', { title: 1, author: 1, likes: 1, url: 1 } )
  response.json(users.map(formatUser))
})

usersRouter.post('/', async (request, response) => {
  try {
    const body = request.body
    const existingUser = await User.find({ username: body.username })
    if (existingUser.length>0) {
      return response.status(400).json({ error: 'username must be unique' })
    }
    if(body.password.length<3) {
      return response.status(400).json({ error: 'password must be at least 3 characters' })
    }
    const saltRounds = 10
    const passwordHash = await bcrypt.hash(body.password, saltRounds)
    console.log(body.password,'->',passwordHash)
    let adult = request.adult
    if(adult===undefined) {
      adult = true
    }
    const user = new User({
      username: body.username,
      name: body.name,
      passwordHash: passwordHash,
      adult: adult
    })

    const savedUser = await user.save()

    response.json(savedUser)
  } catch (exception) {
    console.log(exception)
    response.status(500).json({ error: 'something went wrong...' })
  }
})

module.exports = usersRouter