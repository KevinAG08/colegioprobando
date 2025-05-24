import { BrowserRouter as Router } from "react-router-dom"
import { AuthProvider } from "@/context/AuthContext"
import { Toaster } from "sonner"
import AppRoutes from "@/routes"

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
        <Toaster />
      </AuthProvider>
    </Router>
  )
}

export default App
