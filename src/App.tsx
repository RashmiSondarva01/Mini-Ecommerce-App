import { useRoutes } from 'react-router-dom';
import { Navbar } from './components/Navbar/Navbar';
import { CartDrawer } from './components/CartDrawer/CartDrawer';
import { routes } from './router/routes';

function App() {
  const element = useRoutes(routes);

  return (
    <>
      <Navbar />
      <main>{element}</main>
      <CartDrawer />
    </>
  );
}

export default App;
