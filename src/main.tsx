import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import { AppContextProvider } from './contexts/appContext'
import { LoginPage } from './pages/LoginPage'

const router = createBrowserRouter([
  {
    path: "/",
    element: <LoginPage />
  },
])

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AppContextProvider>
      <RouterProvider router={router} />
    </AppContextProvider>
  </React.StrictMode>,
)
