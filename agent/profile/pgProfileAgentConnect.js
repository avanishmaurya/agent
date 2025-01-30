const { Pool } = require('pg')
const dotenv = require('dotenv')
dotenv.config()

const pool = new Pool({
    user:  process.env.PORTAL_USER,
    host: process.env.PG_HOST,
    port: process.env.PG_PORT,
    password: process.env.PORTAL_PASSWORD,
    database: process.env.PG_DATABASE_AGENTS
 })

 pool.on('error', (err) => {
    console.error('An idle client has experienced an error in pgUserAuthConnect', err.stack)
 })

 module.exports = pool

