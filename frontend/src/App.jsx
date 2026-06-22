import { BrowserRouter, Routes, Route } from "react-router-dom";

import Events from "./pages/Events";
import EventDetails from "./pages/EventDetails";
import Login from "./pages/Login";
import MyTickets from "./pages/MyTickets";
import MyRegistrations from "./pages/MyRegistrations";
import Dashboard from "./pages/Dashboard";
import Analytics from "./pages/Analytics";
import CreateEvent from "./pages/CreateEvent";
import ValidateTicket from "./pages/ValidateTicket";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Events />} />
        <Route path="/events/:eventId" element={<EventDetails />} />
        <Route path="/login" element={<Login />} />
        <Route path="/my-tickets" element={<MyTickets />} />
        <Route path="/my-registrations" element={<MyRegistrations />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/dashboard/create" element={<CreateEvent />} />
        <Route path="/dashboard/event/:eventId" element={<Analytics />} />
        <Route path="/validate-ticket" element={<ValidateTicket />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;