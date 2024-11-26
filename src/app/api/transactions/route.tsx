// api/transactions/route.ts
import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const plate = searchParams.get("id");

  try {
    let query;
    if (plate) {
      query = await sql`SELECT * FROM transactions WHERE plate = ${plate} ;`;
    } else {
      query = await sql`SELECT * FROM transactions order by id desc, entry_time desc ;`;
    }
    return NextResponse.json({ transactions: query.rows });
  } catch (error) {
    console.error("Erro ao consultar transações:", error);
    return NextResponse.json(
      { error: "Erro ao buscar transações" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { plate, vehicle_type, slot_id, entry_time, exit_time, fee } = await request.json();
    await sql`
      INSERT INTO transactions (plate, vehicle_type, slot_id, entry_time, exit_time, fee)
      VALUES (${plate}, ${vehicle_type}, ${slot_id}, ${entry_time}, ${exit_time}, ${fee});
    `;
    await updateSlotStatus(slot_id, 'OCCUPIED');
    return NextResponse.json({ message: "Transação adicionada com sucesso" });
  } catch (error) {
    console.error("Erro ao adicionar transação:", error);
    return NextResponse.json(
      { error: "Erro ao adicionar transação" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  try {
    const transactionResult = await sql`SELECT slot_id FROM transactions WHERE id = ${id};`;
    const slotId = transactionResult.rows[0]?.slot_id;

    await sql`DELETE FROM transactions WHERE id = ${id};`;
    if (slotId) {
      await updateSlotStatus(slotId, 'AVAILABLE');
    }
    return NextResponse.json({ message: "Transação removida com sucesso" });
  } catch (error) {
    console.error("Erro ao remover transação:", error);
    return NextResponse.json(
      { error: "Erro ao remover transação" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  try {
    // Obtenha a taxa base e adicional mais recentes
    const feeConfig = await sql`SELECT base_rate, additional_rate FROM fee_configuration ORDER BY creation_date DESC LIMIT 1;`;
    if (!feeConfig.rows.length) throw new Error("Configuração de taxas não encontrada");

    const { base_rate, additional_rate } = feeConfig.rows[0];

    // Obtenha o horário de entrada da transação
    const entryResult = await sql`SELECT entry_time FROM transactions WHERE id = ${id};`;
    if (!entryResult.rows.length) throw new Error("Transação não encontrada");

    const entryTime = new Date(entryResult.rows[0].entry_time);
    const exitTime = new Date(); // Hora atual como hora de saída

    // Calcule a diferença em milissegundos
    const durationInMillis = exitTime - entryTime;
    
    // Calcule as horas totais (arredondando para cima)
    const hours = Math.ceil(durationInMillis / (1000 * 60 * 60)); 

    // Cálculo da taxa
    let fee = Number(base_rate);
    
    if (hours > 1) {
      fee += (hours - 1) * Number(additional_rate); // Adiciona taxa adicional se passar de 1 hora
    }

    // Atualiza a transação com hora de saída e taxa calculada
    await sql`
      UPDATE transactions 
      SET exit_time = ${exitTime}, fee = ${fee}
      WHERE id = ${id};
    `;

    const transactionResult = await sql`SELECT slot_id FROM transactions WHERE id = ${id};`;
    const slotId = transactionResult.rows[0]?.slot_id;

    if (slotId) {
      await updateSlotStatus(slotId, 'AVAILABLE'); // Atualiza o status da vaga para 'AVAILABLE'
    }

    return NextResponse.json({ message: "Transação finalizada com sucesso" });
  } catch (error) {
    console.error("Erro ao finalizar transação:", error);
    return NextResponse.json({ error: "Erro ao finalizar transação" }, { status: 500 });
  }
}

export async function updateSlotStatus(slotId: number, status: string) {
  try {
    await sql`UPDATE parking_slots SET status = ${status} WHERE id = ${slotId};`;
  } catch (error) {
    console.error("Erro ao atualizar status da vaga:", error);
  }
}

