"use client"
import TransactionsTAble from '../../components/transactions/transactionsList';
import AppBar from '../../components/components/ResponsiveAppBar/ResponsiveAppBar';

const HomePage = () => {
  return (
    <div>
      <AppBar></AppBar>
      {/* <h1>Gerenciamento de vagas</h1> */}
      <TransactionsTAble/>
    </div>
  );
};

export default HomePage;