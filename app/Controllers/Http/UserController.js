'use strict'

const User = use('App/Models/User')
const Token  = use('App/Models/Token')

class UserController {

  async login({ request, auth}) {
    const { email, password } = request.all()
    const token = await auth.attempt(email,password)
    return await auth.withRefreshToken().attempt(email, password)
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

  async store ({ request, response }) {
     try {
       //await auth.getUser()
       const { username, email, password } = request.all();
       const user = await User.create({
          username,
          email,
          password,
       });
       return this.login(...arguments)
     } catch (e) {
       return response.json({message: error.message})
     }
  }


  async show ({ params, request, response, auth }) {
    try {
      await auth.getUser()
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
