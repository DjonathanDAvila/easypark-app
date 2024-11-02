import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { useState, useEffect } from "react";
import CarIcon from "@mui/icons-material/DirectionsCar";
import MotorcycleIcon from "@mui/icons-material/TwoWheeler";
import TruckIcon from "@mui/icons-material/LocalShipping";
// import '../../../';


interface Transaction {
  id: number;
  plate: string;
  vehicle_type: number;
  slot_id: number
  entry_time: Date;
  exit_time: Date;  
  fee: number
}

const getVehicleType = (type: number) => {
    switch (type) {
      case 0:
        return <MotorcycleIcon sx={{ color: "#FF5733" }}/>;
      case 1:
        return <CarIcon sx={{ color: "#007BFF" }}/>;
      case 2:
        return <TruckIcon sx={{ color: "#28A745" }}/>;
      default:
        return null; 
    }
  };

const TransactionsTAble = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchVehicles() {
      try {
        // Faz uma requisição para a API /api/vehicles
        const response = await fetch("/api/transactions");
        const data = await response.json();

        if (response.ok) {
          setTransactions(data.transactions); // Atualiza o estado com os dados dos veículos
        } else {
          setError(data.error || "Erro ao buscar veículos");
        }
      } catch {
        setError("Erro ao fazer a requisição");
      } finally {
        setLoading(false);
      }
    }

    fetchVehicles();
  }, []);

  if (loading) {
    return <p>Carregando veículos...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <TableContainer component={Paper} >
      <Table sx={{ minWidth: 650 }} aria-label="vehicle table">
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Placa</TableCell>
            <TableCell>Tipo</TableCell>
            <TableCell>Entrada</TableCell>
            <TableCell>Saída</TableCell>
            {/* <TableCell>Status</TableCell>             */}
          </TableRow>
        </TableHead>
        <TableBody>
          {transactions.map((transaction) => (
            <TableRow
              key={transaction.id}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {transaction.id}
              </TableCell>
              <TableCell>{transaction.plate}</TableCell>              
              {/* <TableCell>{transaction.vehicle_type}</TableCell> */}
              <TableCell>{getVehicleType(transaction.vehicle_type)}</TableCell>
              <TableCell> {transaction.entry_time ? new Date(transaction.entry_time).toLocaleDateString("pt-BR") : "Data indisponível"}</TableCell>
              <TableCell>{transaction.exit_time ? new Date(transaction.exit_time).toLocaleDateString("pt-BR") : "-"}</TableCell>
                {/* <TableCell>
                  {new Date(vehicle.created_at).toLocaleDateString()}
                </TableCell> */}    
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default TransactionsTAble;
