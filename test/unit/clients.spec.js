'use strict'

const Factory =  use('Factory')
const Client =  use('App/Models/Client')

const  { test, trait }  =  use('Test/Suite')('CRUD Clients')

trait('Test/ApiClient')
trait('Auth/Client')

// Nuevo Cliente
test('Crear un nuevo Cliente',  async  ({ assert, client })  =>  {
  // generar un usuario fake
  const  { username, email, password }  =  await Factory.model('App/Models/Client').make()
  const user = await Factory.model('App/Models/User').create()
  // crear una peticion post a la ruta users
  const response =  await client.post('/clients').send({
    username,
    email,
    password
  })
  .loginVia(user, 'jwt')
  .end()

  // expect the status code to be 200
  response.assertStatus(200)
  // assert the email and username are in the response body
  response.assertJSONSubset({
    message: "Client Created!"
  })
  // assert the user was actually saved in the database
  await Client.query().where({ email }).firstOrFail()
})

// Mostrar Usuario
test('Mostrar un Cliente',  async  ({ assert, client })  =>  {
  // generate a fake user
  const  { username, email, password }  =  await Factory.model('App/Models/Client').make()
  const newUser = await Client.create({
    username, email, password
  })
  // make api request to register a new user
  const response =  await client.get('/clients/'+newUser.id).loginVia(newUser, 'jwt').end()
  // expect the status code to be 200
  response.assertStatus(200)
  response.assertJSONSubset({
    id: newUser.id
  })
})

// Editar Usuario
test('Editar un Cliente',  async  ({ assert, client })  =>  {
  // generate a fake user
  const  { username, email, password }  =  await Factory.model('App/Models/Client').make()

  const newUser = await Client.create({
    username, email, password
  })

  const response =  await client.put('/clients/'+newUser.id).send({
    username,
    email,
    password
  })
  .loginVia(newUser, 'jwt')
  .end()

  // expect the status code to be 200
  response.assertStatus(200)
  // assert the message is in the response body
  response.assertJSONSubset({
    message: 'Client Updated!'
  })
})

// Eliminar Usuario
test('Eliminar un Cliente',  async  ({ assert, client })  =>  {
  // generate a fake user
  const  { username, email, password }  =  await Factory.model('App/Models/Client').make()

  const newUser = await Client.create({
    username, email, password
  })
  // make api request to register a new user
  const response =  await client.delete('/clients/'+newUser.id).loginVia(newUser, 'jwt').end()
  // expect the status code to be 200
  response.assertStatus(200)
  // assert the message and username are in the response body
  response.assertJSONSubset({
    message: 'Client deleted!'
  })
})
