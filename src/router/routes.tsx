import type { RouteObject } from 'react-router-dom';
import { ProductListingPage } from '../pages/ProductListingPage/ProductListingPage';
import { ProductDetailPage } from '../pages/ProductDetailPage/ProductDetailPage';
import { NotFoundPage } from '../pages/NotFoundPage/NotFoundPage';

export const routes: RouteObject[] = [
  { path: '/', element: <ProductListingPage /> },
  { path: '/product/:id', element: <ProductDetailPage /> },
  { path: '/404', element: <NotFoundPage /> },
  { path: '*', element: <NotFoundPage /> },
];
