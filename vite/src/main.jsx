import '@/components/keenicons/assets/styles.css';
import './css/styles.css';
import { createRoot } from 'react-dom/client';
import { App } from './App';
import { CartContextProvider } from './pages/store-client/components/sheets/CartContext';

createRoot(document.getElementById('root')).render(
  <CartContextProvider>
    <App />
  </CartContextProvider>,
);
