const { Pool } = require("pg")
const pool =
    new Pool({
        user: 'postgres',
        host: 'localhost',
        database: 'postgres',
        password: '55555',
        port: '5432',
        max: 20, // Maximum number of clients in the pool 
        idleTimeoutMillis: 30000, // How long a client is allowed to remain idle before being closed 
    });

// Now you can use the pool to execute queries 


pool.connect(function (err: NodeJS.ErrnoException) {
    if (err) throw err;
    console.log("Connected!");
});

const executeQuery = (query: string): Promise<any[]> => {
    return new Promise((res, rej) => {
        pool.query(query, (err: NodeJS.ErrnoException | null, resultSet: any[]) => {
            if (err) return rej(err)
            else return res(resultSet)
        });
    })
}

export default executeQuery