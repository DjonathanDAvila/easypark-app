import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import DeleteIcon from "@mui/icons-material/Delete";
import CarIcon from "@mui/icons-material/DirectionsCar";
import TruckIcon from "@mui/icons-material/LocalShipping";
import MotorcycleIcon from "@mui/icons-material/TwoWheeler";
import { Chip, InputLabel, TextField } from "@mui/material";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import * as React from "react";
import { useEffect, useState } from "react";

import { Transaction } from "../../../models/Transaction";
import AddTransactionModal from "./AddTransactionModal";
import styles from "./styles.module.css";

const getVehicleType = (type) => {
  switch (type) {
    case 0:
      return <MotorcycleIcon sx={{ color: "#FF5733" }} />;
    case 1:
      return <CarIcon sx={{ color: "#007BFF" }} />;
    case 2:
      return <TruckIcon sx={{ color: "#28A745" }} />;
    default:
      return null;
  }
};

export default function TransactionsTable() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [openModal, setOpenModal] = useState(false);
  const [plateInput, setPlateInput] = useState("");

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async (plate: string = "") => {
    try {
      let url = "/api/transactions";
      if (plate) {
        url = `/api/transactions?id=${plate}`;
      }
      const response = await fetch(url);
      const data = await response.json();

      if (response.ok) {
        setTransactions(plate ? [data.transactions[0]] : data.transactions); // Ajuste para caso seja um único item
      } else {
        setError(data.error || "Erro ao buscar transações");
      }
    } catch {
      setError("Erro ao fazer a requisição");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    fetchTransactions(plateInput);
  };

  const handleAddTransaction = async (transaction: Transaction) => {
    try {
      // Define a data e hora atual para entry_time
      const newTransaction = {
        ...transaction,
        entry_time: new Date().toISOString(),
        exit_time: null,
      };

      console.log(newTransaction.entry_time);
      debugger;

      const response = await fetch("/api/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newTransaction),
      });

      if (response.ok) {
        fetchTransactions(); // Atualiza a lista após adicionar
        setOpenModal(false);
      } else {
        setError("Erro ao adicionar transação");
      }
    } catch (error) {
      console.error("Erro ao adicionar transação:", error);
      setError("Erro ao adicionar transação");
    }
  };

  // Função para lidar com remoção
  const handleDeleteTransaction = async (id) => {
    try {
      await fetch(`/api/transactions?id=${id}`, { method: "DELETE" });
      fetchTransactions(); // Atualiza a lista após a remoção
    } catch (error) {
      console.error("Erro ao remover transação:", error);
    }
  };

  // Função para dar baixa na transação
  const handleCloseTransaction = async (id) => {
    try {
      await fetch(`/api/transactions/?id=${id}`, { method: "PATCH" });
      fetchTransactions(); // Atualiza a lista após dar baixa
    } catch (error) {
      console.error("Erro ao dar baixa na transação:", error);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  if (loading) return <p>Carregando transações...</p>;
  if (error) return <p>{error}</p>;

  return (
    <Paper sx={{ width: "100%", overflow: "hidden" }} className={styles.paper}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "20px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <InputLabel>Placa</InputLabel>
          <TextField
            variant="outlined"
            size="small"
            value={plateInput}
            onChange={(e) => setPlateInput(e.target.value)}
            inputProps={{ maxLength: 7 }} // Limite de caracteres
          />
          <Button variant="contained" color="primary" onClick={handleSearch}>
            Buscar
          </Button>
        </div>

        <Button
          variant="contained"
          color="primary"
          onClick={() => setOpenModal(true)}
        >
          +
        </Button>
      </div>

      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader aria-label="transaction table">
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Placa</TableCell>
              <TableCell>Tipo</TableCell>
              <TableCell>Entrada</TableCell>
              <TableCell>Saída</TableCell>
              <TableCell>Taxa</TableCell>
              <TableCell>Ações</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {transactions
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((transaction) => (
                <TableRow
                  hover
                  role="checkbox"
                  tabIndex={-1}
                  key={transaction.id}
                >
                  <TableCell component="th" scope="row">
                    {transaction.id}
                  </TableCell>
                  <TableCell>{transaction.plate}</TableCell>
                  <TableCell>
                    {getVehicleType(transaction.vehicle_type)}
                  </TableCell>
                  <TableCell>
                    {transaction.entry_time
                      ? new Date(transaction.entry_time).toLocaleString(
                          "pt-BR",
                          {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                            second: "2-digit",
                          }
                        )
                      : "Data indisponível"}
                  </TableCell>
                  <TableCell>
                    {transaction.exit_time
                      ? new Date(transaction.exit_time).toLocaleString(
                          "pt-BR",
                          {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                            second: "2-digit",
                          }
                        )
                      : "-"}
                  </TableCell>
                  <TableCell>{transaction.fee}</TableCell>
                  <TableCell>
                    <Button
                      onClick={() => handleDeleteTransaction(transaction.id)}
                      disabled={transaction.exit_time !== null}
                    >
                      <DeleteIcon />
                    </Button>
                    <Button
                      onClick={() => handleCloseTransaction(transaction.id)}
                      disabled={transaction.exit_time !== null}
                    >
                      <CheckCircleIcon />
                    </Button>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={transaction.exit_time ? "Finalizado" : "Pendente"}
                      style={{
                        backgroundColor: transaction.exit_time
                          ? "#28a745"
                          : "#dc3545",
                        color: "#fff",
                        fontWeight: "bold",
                      }}
                    />
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={transactions.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />

      <AddTransactionModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        onAddTransaction={handleAddTransaction}
      />
    </Paper>
  );
}
