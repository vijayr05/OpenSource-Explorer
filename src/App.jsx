import { Outlet } from "react-router-dom"
import Header from "./components/header/Header.jsx"
import ScrollToTop from "./components/ScrollToTop.jsx"

function App() {

  return (
    <div className="min-h-screen bg-ink-950 text-paper">
      <ScrollToTop />
      <Header />

      <main>
        <Outlet />
      </main>
    </div>
  )
}

export default App