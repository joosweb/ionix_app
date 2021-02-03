'use strict'

const User = use('App/Models/User')
const Token  = use('App/Models/Token')

class UserController {

  async login({ request, auth, response}) {
    const email = request.input("email")
    const password = request.input("password");
    try {
      if (await auth.attempt(email, password)) {
      let user = await User.findBy('email', email)
      let accessToken = await auth.generate(user)
      return response.json({"user":user, "access_token": accessToken})
      }
    }
    catch (e) {
      return response.json({message: 'You first need to register!'})
    }
  }

  async logout({ request, auth, response}) {
    try {
      //await auth.check()
      const token = auth.getAuthHeader()
      return await auth.revokeTokens([token])
    } catch (err) {
      response
        .status(404)
        .json({ type: 'error', message: err })
    }
  }

  async index ({ request, response, view, auth }) {
      try {
          //await auth.getUser()
          const page = request.input('page', 1)
          const limit = 10
          const users = await User.query().paginate(page, limit)
          return users;
        } catch (error) {
          return response.json({message: error.message})
      }
  }

  async create ({ request, response, view }) {
  }

  async store ({ request, response, auth }) {
    // get the user data from the request
    const { username, email, password } = request.all()
    const user = await User.create({ username, email, password })
    // generate the jwt for the user
    const token = await auth.generate(user)
    return response.ok({ user, token })
  }



  async show ({ params, request, response, auth }) {
    try {
      //await auth.getUser()
      const user = await User.find(params.id)
      return user
    } catch (error) {
      return response.json({message: error.message})
    }
  }


  async edit ({ params, request, response, view }) {
  }

  async update ({ params, request, response, auth }) {
    try {
      //await auth.getUser()
      let user = await User.find(params.id);
      user.username = request.input('username');
      user.email    = request.input('email');
      user.password = request.input('password');
      await user.save();
      return response.json({message: 'User Updated!'})
    } catch (error) {
      return response.json({message: error.message})
    }
  }

  async destroy ({ params, request, response, auth }) {
    try {
      //await auth.getUser()
      const user = await User.find(params.id)
      const token = await Token.query().where('user_id', params.id).fetch()
      if(!token){
        await token.delete()
      }
      if(user) {
        await user.delete()
      }
      return response.json({message: 'User deleted!'})
    } catch (error) {
      return response.json({message: error.message})
    }
  }
}

module.exports = UserController
