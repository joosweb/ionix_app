'use strict'

/*
|--------------------------------------------------------------------------
| UserSeeder
|--------------------------------------------------------------------------
|
| Make use of the Factory instance to seed database with dummy data or
| make use of Lucid models directly.
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory')

const User = use('App/Models/User')
const Hash = use('Hash')

class UserSeeder {
  async run () {

    // User Demo
    const userDemo = await User.create({
        username: 'demo',
        email:'demo',
        password: 'demo'
    });

    await Factory.model('App/Models/User').createMany(5)
  }
}

module.exports = UserSeeder
