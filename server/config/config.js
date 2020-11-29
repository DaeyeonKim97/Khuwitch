const path = require('path')
require('dotenv').config({path: path.join(__dirname, "../.env")})

const ip = process.env.IP || null
const s_port = process.env.SOCKET_PORT || null
const token = process.env.TOKEN || null

module.exports = {
    'ip' : ip,
    's_port' : s_port,
    'token' : token
}
