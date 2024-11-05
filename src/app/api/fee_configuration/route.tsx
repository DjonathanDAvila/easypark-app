import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { base_rate, additional_rate } = await request.json();

    await sql`
      INSERT INTO fee_configuration (base_rate, additional_rate)
      VALUES (${base_rate}, ${additional_rate});
    `;

    return NextResponse.json({ message: "Configuração de taxas adicionada com sucesso" });
  } catch (error) {
    console.error("Erro ao adicionar configuração de taxas:", error);
    return NextResponse.json({ error: "Erro ao adicionar configuração de taxas" }, { status: 500 });
  }
}
