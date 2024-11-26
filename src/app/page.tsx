import AppBar from './components/components/ResponsiveAppBar/ResponsiveAppBar'
import { redirect } from 'next/navigation';


export default function ResponsiveAppBar() {
  redirect('/pages/home'); 
  return (
    <header>
      <AppBar/>
    </header>
  );
}
