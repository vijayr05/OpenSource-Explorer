import { Outlet } from "react-router-dom"
import { Header } from "./components"
import { ScrollToTop } from "./components"

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