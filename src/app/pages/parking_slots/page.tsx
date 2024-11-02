"use client"
import Parking_slotsList from '../../components/parking_slots/parking_slotsList';
import AppBar from '../../components/components/ResponsiveAppBar/ResponsiveAppBar';

const VehiclesPage = () => {
  return (
    <div>
      <AppBar></AppBar>
      <h1>Gerenciamento de vagas</h1>
      <Parking_slotsList/>
    </div>
  );
};

export default VehiclesPage;