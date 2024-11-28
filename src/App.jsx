import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Home } from "./Pages/Home";
import { NavigationBar } from "./Components/NavigationBar";
import { CalendarSchedule } from "./Components/Calendar";
import { AdminDashboard } from "./Pages/AdminDashboard";
import { Login } from "./Pages/Login";
import { Signup } from "./Pages/SignUp";
import { MyEvents } from "./Components/MyEvents";
import { UserManagement } from "./Components/AdminComponents/UserManagement";
import { AvailabilityOverview } from "./Components/AdminComponents/AvailabilityOverview";
import { EventsOverview } from "./Components/AdminComponents/EventsOverview";

function App() {
  return (
    <>
      <Router>
        <NavigationBar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/events" element={<CalendarSchedule height={500} />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Signup />} />
          <Route path="/myevents" element={<MyEvents />} />

          {/* Admin Routes */}
          <Route path="/admin" element={<AdminDashboard />}>
            <Route path="events" element={<EventsOverview />} />
            <Route path="users" element={<UserManagement />} />
            <Route path="availability" element={<AvailabilityOverview />} />
          </Route>
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
  );
}

export default App;
