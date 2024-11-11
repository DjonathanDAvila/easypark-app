'use server';

import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";

export async function GET() {
  try {    
    const { rows } = await sql`
      SELECT id, slot_number FROM parking_slots WHERE status = 'AVAILABLE';
    `;
    // Retornando slots com id e slot_number
    return NextResponse.json({ slots: rows.map(row => ({ id: row.id, slot_number: row.slot_number })) });
  } catch (error) {
    console.error('Erro ao consultar vagas disponíveis:', error);
    return NextResponse.json({ error: "Erro ao buscar vagas disponíveis" }, { status: 500 });
  }
}
