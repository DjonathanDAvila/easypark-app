'use server';

import { sql } from "@vercel/postgres";

// import { Pool } from 'pg';

// let pool: Pool | null = null;

// const getPool = () => {
//   if (!pool) {
//     pool = new Pool({
//       connectionString: process.env.POSTGRES_URL,
//     });
//   }
//   return pool;
// };

export async function queryVehicles() {
  try {
    // const pool = getPool();
    // const { rows } = await pool.query('SELECT * FROM vehicles');
    const { rows } = await sql`SELECT * FROM vehicles;`;
    return rows;
  } catch (error) {
    console.error('Erro ao consultar veículos:', error);
    throw error;
  }
}