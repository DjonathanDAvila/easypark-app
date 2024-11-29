import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const totalSlots = await sql`SELECT COUNT(*) as total FROM parking_slots;`;
    const occupiedSlots =
      await sql`SELECT COUNT(*) as occupied FROM parking_slots WHERE status = 'OCCUPIED';`;
    const dailyEarnings = await sql`
      SELECT COALESCE(SUM(fee), 0) as daily
      FROM transactions
      WHERE entry_time::date = CURRENT_DATE;
    `;
    const monthlyEarnings = await sql`
      SELECT COALESCE(SUM(fee), 0) as monthly
      FROM transactions
      WHERE date_trunc('month', entry_time) = date_trunc('month', CURRENT_DATE);
    `;

    const paymentsPending = await sql`
      SELECT COALESCE(COUNT(fee), 0) as pending
      FROM transactions
      WHERE exit_time IS NULL
        AND fee IS NOT NULL;
    `;
    
    return NextResponse.json({
      totalSlots: Number(totalSlots.rows[0].total),
      occupiedSlots: Number(occupiedSlots.rows[0].occupied),
      freeSlots: Number(
        totalSlots.rows[0].total - occupiedSlots.rows[0].occupied
      ),
      dailyEarnings: Number(dailyEarnings.rows[0].daily),
      paymentsPending: Number(paymentsPending.rows[0].pending),
      monthlyEarnings: Number(monthlyEarnings.rows[0].monthly),
    });
  } catch (error) {
    console.error("Erro ao obter resumo:", error);
    return NextResponse.json(
      { error: "Erro ao obter resumo" },
      { status: 500 }
    );
  }
}
