import { Box, Button, Card, TextField, Typography } from "@mui/material";
import { useState } from "react";

const TaxForm = () => {
  const [baseRate, setBaseRate] = useState("");
  const [hourlyRate, setHourlyRate] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSave = async () => {
    try {
      const response = await fetch("/api/fee_configuration", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          base_rate: parseFloat(baseRate),
          additional_rate: parseFloat(hourlyRate),
        }),
      });

      if (!response.ok) {
        throw new Error("Erro ao adicionar configuração de taxas");
      }

      // Aqui você pode adicionar alguma lógica adicional, como limpar os campos ou exibir uma mensagem de sucesso.
      setBaseRate("");
      setHourlyRate("");
      setError(null);
    } catch (error) {
      console.error("Erro ao adicionar configuração de taxas:", error);
      setError("Erro ao adicionar configuração de taxas");
    }
  };

  return (
    <Box
      component="form"
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
        width: "100%",
        maxWidth: "500px",
        margin: "0 auto",
        minHeight: "80vh",
        justifyContent: "center",
      }}
      noValidate
      autoComplete="off"
    >
      <Card
        sx={{ padding: 4, display: "flex", flexDirection: "column", gap: 2 }}
      >
        <Typography gutterBottom variant="h5" component="div">
          Configuração das taxas
        </Typography>
        <TextField
          id="base-rate"
          label="Taxa base"
          type="number"
          variant="outlined"
          value={baseRate}
          onChange={(e) => setBaseRate(e.target.value)}
          slotProps={{
            inputLabel: {
              shrink: true,
            },
          }}
        />
        <TextField
          id="hourly-rate"
          label="Valor adicional por hora"
          type="number"
          variant="outlined"
          value={hourlyRate}
          onChange={(e) => setHourlyRate(e.target.value)}
          slotProps={{
            inputLabel: {
              shrink: true,
            },
          }}
        />
        {error && <Typography color="error">{error}</Typography>}
        <Box
          sx={{
            display: "flex",
            gap: 1,
            marginTop: 2,
          }}
        >
          <Button variant="contained" sx={{ flex: 1 }} onClick={handleSave}>
            Salvar
          </Button>
          <Button variant="text" sx={{ flex: 1 }}>
            Cancelar
          </Button>
        </Box>
      </Card>
    </Box>
  );
};

export default TaxForm;
