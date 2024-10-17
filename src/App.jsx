
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { Home } from './Pages/Home'
import { NavigationBar } from './Components/NavigationBar'
import { CalendarSchedule } from './Components/Calendar'
import { AdminDashboard } from './Pages/AdminDashboard'
import { Login } from './Pages/Login'
import { Signup } from './Pages/SignUp'

function App() {
  return (
    <>
     <Router>
      <NavigationBar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/events" element={<CalendarSchedule height={500} />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Signup />} />
        </Routes>
      </Router>

      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        draggable
        pauseOnFocusLoss
      />
    </>
  )
}

export default App
