import { createRoot } from 'react-dom/client';
import './styles/all.css';
import { createHashRouter, RouterProvider } from 'react-router';
import { routes } from './router/index.jsx';
import { store } from '@/store';
import { Provider } from 'react-redux';

const router = createHashRouter(routes);

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>,
);
