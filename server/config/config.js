const path = require('path')
require('dotenv').config({path: path.join(__dirname, "../.env")})

const ip = process.env.IP || null
const token = process.env.TOKEN || null

module.exports = {
    'ip' : ip,
    'token' : token
}
