// src/App.jsx

import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./Login.jsx";
import Welcome from "./Welcome.jsx";
import RaiseTicket from "./RaiseTicket";
import ServiceTicket from "./ServiceTicket";
import TicketStatus from "./TicketStatus.jsx";

import AddExecutive from "./pages/Addexec.jsx";
import ViewTickets from "./pages/ViewTickets.jsx";
import AdminLogin from "./pages/AdminLogin.jsx";
import AdminWelcome from "./pages/AdminWelcome.jsx";
import AdminProtectedRoute from "./components/AdminProtectedRoute.jsx";
import EditExecutive from "./pages/EditExec.jsx";
import ViewDownloadReport from "./pages/ViewDownloadReport.jsx";
import EditTicket from "./pages/EditTicket.jsx";
import AddOperation from "./pages/AddOperation";
import OperationsLogin from "./pages/OperationsLogin.jsx";
import OperationsWelcome from "./pages/OperationsWelcome.jsx";
import OperationsChangeStatus from "./pages/Op_pages/OPerationsChangeStatus.jsx";
import ViewDownloadMyReport from "./ViewDownloadReport.jsx";
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/welcome" element={<Welcome />} />
        <Route path="/raise-ticket" element={<RaiseTicket />} />
        <Route path="/tickets/:serviceSlug" element={<ServiceTicket />} />
        <Route path="/ticket-status" element={<TicketStatus />} />

        {/* ✅ User Report Route (My Raised Tickets) */}
        <Route path="/view-download-report" element={<ViewDownloadMyReport />} />

        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />

        <Route
          path="/admin"
          element={
            <AdminProtectedRoute>
              <AdminWelcome />
            </AdminProtectedRoute>
          }
        />

        <Route
          path="/admin/tickets/view"
          element={
            <AdminProtectedRoute>
              <ViewTickets />
            </AdminProtectedRoute>
          }
        />

        <Route
          path="/admin/executives/add"
          element={
            <AdminProtectedRoute>
              <AddExecutive />
            </AdminProtectedRoute>
          }
        />

        <Route
          path="/admin/executives/edit"
          element={
            <AdminProtectedRoute>
              <EditExecutive />
            </AdminProtectedRoute>
          }
        />

        <Route
          path="/admin/reports"
          element={
            <AdminProtectedRoute>
              <ViewDownloadReport />
            </AdminProtectedRoute>
          }
        />

        <Route
          path="/admin/tickets/edit"
          element={
            <AdminProtectedRoute>
              <EditTicket />
            </AdminProtectedRoute>
          }
        />

        {/* Operations Routes */}
        <Route path="/operations-login" element={<OperationsLogin />} />
        <Route path="/operations" element={<OperationsWelcome />} />

        <Route path="/operations/tickets/edit" element={<EditTicket />} />

        <Route path="/operations/tickets/reports" element={<ViewDownloadReport />} />

        <Route path="/operations/tickets/view" element={<ViewTickets />} />

        <Route path="/admin/add-operation" element={<AddOperation />} />

        <Route
          path="/operations/tickets/status"
          element={<OperationsChangeStatus />}
        />
      </Routes>
    </BrowserRouter>
  );
}
