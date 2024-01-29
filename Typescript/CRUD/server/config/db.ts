import { createPool } from 'mysql2'

import dotenv from 'dotenv'
import { Query, QueryError } from 'mysql2/typings/mysql/lib/protocol/sequences/Query'
import { PoolConnection } from 'mysql2/typings/mysql/lib/PoolConnection'
import { any } from 'prop-types'

dotenv.config()

const connetion = createPool({
    host: process.env.DB_HOST,
    port: 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_DATABASE
})

const executeQuery = (query: string): Promise<any[]> => {
    return new Promise((resolve, reject) => {
        connetion.getConnection((err: NodeJS.ErrnoException | null, conn: PoolConnection) => {
            conn.query(query, (err, resultSet: any[]) => {
                conn.release();
                if (err) {
                    return reject(err);
                }
                return resolve(resultSet);
            });
        });
    });
}

export default executeQuery
