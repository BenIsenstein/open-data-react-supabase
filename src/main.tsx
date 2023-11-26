import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import { AppContextProvider, useAppContext } from './contexts/appContext'

const App = () => {
  const { signup, user, error } = useAppContext()

  return (
    <div className="w-full">
      <button
        onClick={signup}
        className=" p-2 rounded-md bg-zinc-300 text-zinc-950 font-bold">
        Sign Up
      </button>
      {error && (
        <p>ERROR: {error.status} {error.message}</p>
      )}
      {user && (
        <>
          <p>{user.id}</p>
          <p>{user.email}</p>
          <p>{user.created_at}</p>
          <p>{JSON.stringify(user.user_metadata)}</p>
        </>
      )}
    </div>
  )
}

const router = createBrowserRouter([
  {
    path: "/",
    element:  <App />
  },
])

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
      <AppContextProvider>
        <RouterProvider router={router} />
      </AppContextProvider>
  </React.StrictMode>,
)
