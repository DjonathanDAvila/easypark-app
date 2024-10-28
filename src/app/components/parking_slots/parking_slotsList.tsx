import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { useState, useEffect } from "react";

interface Vehicle {
  id: number;
  slot_number: string;
  status: string;
}

const VehicleTable = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchVehicles() {
      try {
        // Faz uma requisição para a API /api/vehicles
        const response = await fetch("/api/parking_slots");
        const data = await response.json();

        if (response.ok) {
          setVehicles(data.vehicles); // Atualiza o estado com os dados dos veículos
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
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="vehicle table">
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Placa</TableCell>
            <TableCell>Modelo</TableCell>
            <TableCell>Cor</TableCell>
            <TableCell>Criado em</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {vehicles.map((vehicle) => (
            <TableRow
              key={vehicle.id}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {vehicle.id}
              </TableCell>
              <TableCell>{vehicle.slot_number}</TableCell>
              <TableCell>{vehicle.status}</TableCell>              
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

export default VehicleTable;
