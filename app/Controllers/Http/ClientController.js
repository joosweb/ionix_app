'use strict'

const Client = use('App/Models/Client')
const Token  = use('App/Models/Token')

class ClientController {

  async index ({ request, response, view, auth }) {
      try {
          await auth.getUser()
          const page = request.input('page', 1)
          const limit = 10
          const clients = await Client.query().paginate(page, limit)
          return clients;
        } catch (error) {
          return response.json({message: error.message})
      }
  }

  async create ({ request, response, view }) {
  }

  async store ({ request, response, auth }) {
     try {
       await auth.getUser()
       const { username, email, password } = request.all();
       const client = await Client.create({
          username,
          email,
          password,
       });
       return response.json({message: 'Client Created!'})
     } catch (e) {
       return response.json({message: e.message})
     }
  }


  async show ({ params, request, response, auth }) {
    try {
      await auth.getUser()
      const client = await Client.find(params.id)
      return client
    } catch (error) {
      return response.json({message: error.message})
    }
  }


  async edit ({ params, request, response, view }) {
  }

  async update ({ params, request, response, auth }) {
    try {
      await auth.getUser()
      let client = await Client.find(params.id);
      client.username = request.input('username');
      client.email    = request.input('email');
      client.password = request.input('password');
      await client.save();
      return response.json({message: 'Client Updated!'})
    } catch (error) {
      return response.json({message: error.message})
    }
  }

  async destroy ({ params, request, response, auth }) {
    try {
      await auth.getUser()
      const user = await Client.find(params.id)
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

module.exports = ClientController
