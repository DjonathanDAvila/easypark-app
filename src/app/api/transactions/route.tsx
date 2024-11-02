'use server';

import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";

// Função que lida com requisições GET para a rota /api/vehicles
export async function GET() {
  try {
    const { rows } = await sql`SELECT * FROM transactions;`;
    return NextResponse.json({ transactions: rows });
  } catch (error) {
    console.error('Erro ao consultar transações:', error);
    return NextResponse.json({ error: "Erro ao buscar transações" }, { status: 500 });
  }
}