'use server';

import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";

// Função que lida com requisições GET para a rota /api/vehicles
export async function GET() {
  try {
    const { rows } = await sql`SELECT * FROM parking_slots ORDER BY ID;`;
    return NextResponse.json({ vehicles: rows });
  } catch (error) {
    console.error('Erro ao consultar veículos:', error);
    return NextResponse.json({ error: "Erro ao buscar veículos" }, { status: 500 });
  }
}