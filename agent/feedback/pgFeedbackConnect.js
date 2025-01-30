const { Pool } = require('pg')
const dotenv = require('dotenv')
dotenv.config()

const pool = new Pool({
    user:  process.env.AGENT_PORTAL_USER,
    host: process.env.PG_HOST,
    port: process.env.PG_PORT,
    password: process.env.AGENT_PORTAL_PASSWORD,
    database: process.env.PG_DATABASE_AGENT_PORTAL
 })

 pool.on('error', (err) => {
    console.error('An idle client has experienced an error in pgReferralConnect', err.stack)
 })

 module.exports = pool

