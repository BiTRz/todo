import dotenv from 'dotenv'
import pkg from 'pg'

dotenv.config()
const enviroment = process.env.NODE_ENV

const { Pool } = pkg

const openDb = () => {
    const pool = new Pool ({
        user: process.env.DB_USER,
        host: process.env.DB_HOST,
        database: enviroment === 'test' ? process.env.TEST_DB_NAME : process.env.DB_NAME,
        password: process.env.DB_PASSWORD,
        port: process.env.DB_PORT
    })
    return pool
}

const pool = openDb()

export { pool }