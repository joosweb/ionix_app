'use strict'

/*
|--------------------------------------------------------------------------
| ClientSeeder
|--------------------------------------------------------------------------
|
| Make use of the Factory instance to seed database with dummy data or
| make use of Lucid models directly.
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory')

const User = use('App/Models/Client')
const Hash = use('Hash')

class ClientSeeder {
  async run () {
    await Factory.model('App/Models/Client').createMany(10)
  }
}

module.exports = ClientSeeder
