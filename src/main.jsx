import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { RouterProvider, createBrowserRouter } from "react-router-dom"

import Home from "./pages/Home.jsx"
import Search from "./pages/Search.jsx"
import Repository from "./pages/Repository.jsx"
import Profile from "./pages/Profile.jsx"

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <Home />
      },
      {
        path: "/search",
        element: <Search />
      },
      {
        path: "/repository/:owner/:repo",
        element: <Repository />
      },
      {
        path: "/profile",
        element: <Profile />
      },
      {
        path: "/profile/:username",
        element: <Profile />
      }
    ]

  }
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
