import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import EventIcon from '@mui/icons-material/Event';
import LocalParkingIcon from '@mui/icons-material/LocalParking';
import { Card, CardContent, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';

import styles from './styles.module.css';

export const SummaryCards = () => {
  const [data, setData] = useState({
    totalSlots: 0,
    occupiedSlots: 0,
    freeSlots: 0,
    dailyEarnings: 0,
    paymentsPending: 0,
    monthlyEarnings: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("/api/summary");
      const result = await response.json();
      setData(result);
    };
    fetchData();
  }, []);

  return (
    <div className={styles.summaryContainer}>
      {/* Cartão de Vagas */}
      <Card className={styles.card}>
        <CardContent>
          <Typography variant="h5">
            <LocalParkingIcon /> Total de Vagas
          </Typography>
          <Typography variant="h3">{data.totalSlots}</Typography>
          <div className={styles.slotDetails}>
            <div className={styles.slotInfo}>
              <span className={styles.freeSlot}>Livre</span>
              <span className={styles.freeBadge}>{data.freeSlots}</span>
            </div>
            <div className={styles.slotInfo}>
              <span className={styles.occupiedSlot}>Ocupadas</span>
              <span className={styles.occupiedBadge}>{data.occupiedSlots}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Cartão de Ganhos do Dia */}
      <Card className={styles.card}>
        <CardContent>
          <Typography variant="h5">
            <AttachMoneyIcon /> Ganhos do Dia
          </Typography>
          <Typography variant="h3">
            R${Number(data.dailyEarnings).toFixed(2)}
          </Typography>
          <div className={styles.paymentDetails}>
            <div className={styles.paymentInfo}>
              <span className={styles.received}>Recebidos</span>
              <span className={styles.receivedBadge}>
                {data.dailyEarnings} {/* Valor recebido */}
              </span>
            </div>
            <div className={styles.paymentInfo}>
              <span className={styles.pending}>Pendentes</span>
              <span className={styles.pendingBadge}>
                {data.paymentsPending} {/* Pagamentos pendentes */}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Cartão de Ganhos do Mês */}
      <Card className={styles.card}>
        <CardContent>
          <Typography variant="h5">
            <EventIcon /> Ganhos do Mês
          </Typography>
          <Typography variant="h3">
            R${Number(data.monthlyEarnings).toFixed(2)}
          </Typography>
        </CardContent>
      </Card>
    </div>
  );
};
