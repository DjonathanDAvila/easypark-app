// src/models/transaction.ts
export interface Transaction {
    id: number;
    plate: string;
    vehicle_type: number;
    slot_id: number;
    entry_time: Date;
    exit_time: Date | null;
    fee: number;
  }
  