import { Layout } from '../views/frontend/layout/Home';
import { Home } from '../views/frontend/Homepage';
import { Products } from '../views/frontend/Products';
import { Product } from '../views/frontend/Product';
import { Cart } from '../views/frontend/Cart';
import { Checkout } from '../views/frontend/Checkout';
import { NotFound } from '../views/frontend/NotFound';
import { Dashboard } from '../views/backend/layout/Dashboard';
import { ManageProducts } from '../views/backend/ManageProducts';
import { Login } from '../views/backend/Login';
import { AdminGuard } from './AdminGuard';

export const routes = [
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        path: '',
        element: <Home />,
      },
      {
        path: 'products',
        element: <Products />,
      },
      {
        path: 'product/:id',
        element: <Product />,
      },
      {
        path: 'cart',
        element: <Cart />,
      },
      {
        path: 'checkout',
        element: <Checkout />,
      },
      {
        path: '*',
        element: <NotFound />,
      },
    ],
  },
  {
    path: '/admin',
    element: <AdminGuard mode="admin" />,
    children: [
      {
        element: <Dashboard />,
        children: [
          {
            path: 'product',
            element: <ManageProducts />,
          },
        ],
      },
    ],
  },
  {
    path: '/login',
    element: <AdminGuard mode="login" />,
    children: [
      {
        path: '',
        element: <Login />,
      },
    ],
  },
];
