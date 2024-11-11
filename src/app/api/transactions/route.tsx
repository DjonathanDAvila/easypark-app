// api/transactions/route.ts
import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const plate = searchParams.get("id");

  try {
    let query;
    if (plate) {
      query = await sql`SELECT * FROM transactions WHERE plate = ${plate};`;
    } else {
      query = await sql`SELECT * FROM transactions;`;
    }
    return NextResponse.json({ transactions: query.rows });
  } catch (error) {
    console.error("Erro ao consultar transações:", error);
    return NextResponse.json({ error: "Erro ao buscar transações" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { plate, vehicle_type, slot_id, entry_time, exit_time, fee } = await request.json();
    await sql`
      INSERT INTO transactions (plate, vehicle_type, slot_id, entry_time, exit_time, fee)
      VALUES (${plate}, ${vehicle_type}, ${slot_id}, ${entry_time}, ${exit_time}, ${fee});
    `;
    return NextResponse.json({ message: "Transação adicionada com sucesso" });
  } catch (error) {
    console.error("Erro ao adicionar transação:", error);
    return NextResponse.json({ error: "Erro ao adicionar transação" }, { status: 500 });
  }
}
