import { useEffect, useState } from "react";
import { Box, Button, Card, TextField, Typography, Alert } from "@mui/material";
import { useRouter } from "next/navigation";

const TaxForm = () => {
  const [baseRate, setBaseRate] = useState("");
  const [hourlyRate, setHourlyRate] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const router = useRouter();

  const fetchLastConfiguration = async () => {
    try {
      const response = await fetch(
        "/api/fee_configuration/get_last_configuration"
      );
      if (response.ok) {
        const data = await response.json();
        setBaseRate(data.base_rate);
        setHourlyRate(data.additional_rate);
      } else {
        console.error("Erro ao buscar a última configuração de taxas");
      }
    } catch (error) {
      console.error("Erro ao buscar a última configuração de taxas:", error);
    }
  };

  useEffect(() => {
    fetchLastConfiguration();
  }, []);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const newConfiguration = {
      base_rate: parseFloat(baseRate),
      additional_rate: parseFloat(hourlyRate),
    };

    try {
      const response = await fetch("/api/fee_configuration", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newConfiguration),
      });

      if (response.ok) {
        setShowAlert(true);

        setTimeout(() => {
          setShowAlert(false);
        }, 5000);
      } else {
        console.error("Erro ao adicionar configuração de taxas");
      }
    } catch (error) {
      console.error("Erro ao adicionar configuração de taxas:", error);
    }
  };

  const handleCancel = () => {
    router.push("/pages/home");
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
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
      {showAlert && (
        <Alert variant="filled" severity="success">
          Configurações atualizadas com sucesso!
        </Alert>
      )}
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
          InputLabelProps={{
            shrink: true,
          }}
        />
        <TextField
          id="hourly-rate"
          label="Valor adicional por hora"
          type="number"
          variant="outlined"
          value={hourlyRate}
          onChange={(e) => setHourlyRate(e.target.value)}
          InputLabelProps={{
            shrink: true,
          }}
        />
        <Box
          sx={{
            display: "flex",
            gap: 1,
            marginTop: 2,
          }}
        >
          <Button type="submit" variant="contained" sx={{ flex: 1 }}>
            Salvar
          </Button>
          <Button variant="text" onClick={handleCancel} sx={{ flex: 1 }}>
            Cancelar
          </Button>
        </Box>
      </Card>
    </Box>
  );
};

export default TaxForm;
