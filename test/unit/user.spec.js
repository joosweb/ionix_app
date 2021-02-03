'use strict'

const Factory =  use('Factory')
const User =  use('App/Models/User')

const  { test, trait }  =  use('Test/Suite')('CRUD Users')

trait('Test/ApiClient')

// Iniciar Sesión
test('Iniciar Sesión y obtener el token',  async  ({ assert, client })  =>  {
  // generar un usuario fake
  const  { username, email, password }  =  await Factory.model('App/Models/User').make()
  // salvar el usuario fake a la base de datos
  await User.create({
    username, email, password
  })
    
  // crear una peticion post a la ruta login con el usuario
  const response =  await client.post('/login').send({
    email, password
  }).end()
  // afirmar que el estado es 200
  response.assertStatus(200)
  // afirmar que el token type Bearer y el token mismo existe en el body
  assert.isDefined(response.body.access_token.type)
  assert.isDefined(response.body.access_token.token)

})

// Nuevo Usuario
test('Crear un nuevo Usuario',  async  ({ assert, client })  =>  {
  // generar un usuario fake
  const  { username, email, password }  =  await Factory.model('App/Models/User').make()
    // crear una peticion post a la ruta users
  const response =  await client.post('/users').send({
    username,
    email,
    password
  }).end()

  // expect the status code to be 200
  response.assertStatus(200)
  // assert the email and username are in the response body
  response.assertJSONSubset({
    user: {
      email,
      username
    }
  })
  // assert the token was in request
  assert.isDefined(response.body.token)
  // assert the user was actually saved in the database
  await User.query().where({ email }).firstOrFail()
})

// Mostrar Usuario
test('Mostrar un Usuario',  async  ({ assert, client })  =>  {
  // generate a fake user
  const  { username, email, password }  =  await Factory.model('App/Models/User').make()
  // make api request to register a new user
  const response =  await client.get('/users/2').send().end()
  // expect the status code to be 200
  response.assertStatus(200)
})

// Editar Usuario
test('Editar un Usuario',  async  ({ assert, client })  =>  {
  // generate a fake user
  const  { username, email, password }  =  await Factory.model('App/Models/User').make()
  // make api request to register a new user
  const response =  await client.put('/users/1').send({
    username,
    email,
    password
  }).end()
  // expect the status code to be 200
  response.assertStatus(200)
  // assert the message is in the response body
  response.assertJSONSubset({
    message: 'User Updated!'
  })
})

// Eliminar Usuario
test('Eliminar un Usuario',  async  ({ assert, client })  =>  {
  // generate a fake user
  const  { username, email, password }  =  await Factory.model('App/Models/User').make()
  // make api request to register a new user
  const response =  await client.delete('/users/3').end()
  // expect the status code to be 200
  response.assertStatus(200)
  // assert the message and username are in the response body
  response.assertJSONSubset({
    message: 'User deleted!'
  })
})
