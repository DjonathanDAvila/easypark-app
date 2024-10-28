"use client"
import VehicleList from '../components/parking_slots/parking_slotsList';
import AppBar from '../components/components/ResponsiveAppBar/ResponsiveAppBar';

const VehiclesPage = () => {
  return (
    <div>
      <AppBar></AppBar>
      <h1>Gerenciamento de vagas</h1>
      <VehicleList/>
    </div>
  );
};

export default VehiclesPage;
