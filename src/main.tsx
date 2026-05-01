import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './App.css'
import { RouterProvider } from "react-router-dom";
import { router } from './Routes/Routes.tsx';
import './i18n';





createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
