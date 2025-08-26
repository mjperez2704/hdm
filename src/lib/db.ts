
import mysql from 'mysql2/promise';

let pool: mysql.Pool | null = null;

export function getPool(): mysql.Pool {
  if (pool) {
    return pool;
  }
  
  const config: mysql.PoolOptions = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT) || 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    connectTimeout: 10000,
  };

  pool = mysql.createPool(config);
  return pool;
}

export async function query<T>(sql: string, params: any[] = []): Promise<T> {
  const connectionPool = getPool();
  try {
    const [results] = await connectionPool.query(sql, params);
    return results as T;
  } catch (error: any) {
    console.error('Database query error:', error.message);
    throw error;
  }
}
