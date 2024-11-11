import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Button,
  MenuItem,
  Grid,
  Select,
  InputLabel,
  FormControl,
} from '@mui/material';
import { Transaction } from '../../../models/Transaction';

interface AddTransactionModalProps {
  open: boolean;
  onClose: () => void;
  onAddTransaction: (transaction: Transaction) => Promise<void>; // Certifique-se de que é uma Promise
}

const vehicleTypes = [
  { value: 0, label: "Moto" },
  { value: 1, label: "Carro" },
  { value: 2, label: "Caminhão" },
];

const AddTransactionModal: React.FC<AddTransactionModalProps> = ({ open, onClose, onAddTransaction }) => {
  const [plate, setPlate] = useState("");
  const [vehicleType, setVehicleType] = useState(0);
  const [slotId, setSlotId] = useState<number | undefined>(undefined);
  const [availableSlots, setAvailableSlots] = useState<{ id: number; slot_number: string }[]>([]);

  const fetchAvailableSlots = async () => {
        
    try {
      const response = await fetch("/api/available-slots");
      const data = await response.json();      
      console.log("Slots disponíveis:", data.slots); // Log dos slots disponíveis
      setAvailableSlots(data.slots);
    } catch (error) {
      console.error("Erro ao buscar vagas disponíveis:", error);
    }
  };

  useEffect(() => {
    fetchAvailableSlots();
  }, []);

  const handleAdd = async () => {
    if (!plate || !slotId) return;

    const newTransaction = {
      id: Math.random(),
      plate,
      vehicle_type: vehicleType,
      slot_id: slotId,
      entry_time: new Date(),
      exit_time: null,
      fee: 0,
    };

    console.log("Adicionando nova transação:", newTransaction); // Log da nova transação

    // Chame a função para adicionar a transação
    await onAddTransaction(newTransaction);

    // Após adicionar a transação, busque os slots novamente
    await fetchAvailableSlots();

    // Limpe os campos do formulário
    setPlate("");
    setSlotId(undefined);
    setVehicleType(0);
    
    // Feche o modal
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Adicionar Transação</DialogTitle>
      <DialogContent>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              autoFocus
              label="Placa"
              fullWidth
              value={plate}
              onChange={(e) => setPlate(e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel>Tipo de Veículo</InputLabel>
              <Select
                value={vehicleType}
                onChange={(e) => setVehicleType(Number(e.target.value))}
              >
                {vehicleTypes.map((type) => (
                  <MenuItem key={type.value} value={type.value}>
                    {type.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel>Vaga Disponível</InputLabel>
              <Select
                value={slotId || ""}
                onChange={(e) => setSlotId(Number(e.target.value))}
              >
                {availableSlots.map((slot) => (
                  <MenuItem key={slot.id} value={slot.id}>
                    {`Vaga ${slot.slot_number}`}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button onClick={handleAdd} color="primary">
          Adicionar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddTransactionModal;