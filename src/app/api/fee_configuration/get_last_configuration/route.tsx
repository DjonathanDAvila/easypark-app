import { NextResponse } from "next/server";
import { sql } from "@vercel/postgres";

export async function GET() {
  try {
    const result = await sql`
      SELECT * FROM fee_configuration
      ORDER BY creation_date DESC
      LIMIT 1;
    `;
    if (result.rows.length > 0) {
      return NextResponse.json(result.rows[0]);
    } else {
      return NextResponse.json({ error: "Nenhuma configuração encontrada" }, { status: 404 });
    }
  } catch (error) {
    console.error("Erro ao buscar a última configuração:", error);
    return NextResponse.json({ error: "Erro ao buscar configuração" }, { status: 500 });
  }
}
