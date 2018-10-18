'use strict'
let env = process.env.NODE_ENV
let env1 = `"${env}"`
console.log(env + 'ddd')
module.exports = {
    NODE_ENV: env1
}