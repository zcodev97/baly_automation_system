import Tickets from "./pages/ticketing-system/tickets/Tickets";
import "./App.css";
import NewTicket from "./pages/ticketing-system/tickets/NewTicket";
import Footer from "./components/footer";
import NoPage from "./pages/NoPage";
import Login from "./pages/Login";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { useEffect, useState } from "react";
import TicketDetails from "./pages/ticketing-system/tickets/TicketDetails";
import Loading from "./components/loading";
import { Vendors } from "./pages/Vendors";
import VendorDetails from "./pages/VendorDetails";
import { Users } from "./pages/ticketing-system/users/Users";
import UserDetails from "./pages/ticketing-system/users/UserDetails";
import ReportView from "./pages/ReportView";
import ReportsPage from "./pages/Reports";
import HomePage from "./pages/Home";
import GetNewCustomersReportPage from "./pages/reports/GetNewCustomers";
import HourlyReportPage from "./pages/reports/Hourly";
import { BACKEND_URL } from "./global";
import VendorKPIReport from "./pages/reports/VendorKpiReport";
import CancellationReport from "./pages/reports/CancellationReport";
import VendorInvoiceReport from "./pages/reports/VendorInvoice";
import UserTicketsPage from "./pages/ticketing-system/tickets/UserTickets";
import ExceReaderPage from "./pages/ExcelReader";

function App() {
  const [savedUser, setSavedUser] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentUsername, setcurrentUsername] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);

  async function getSavedUserInLocalStorage() {
    setLoading(true);

    var token = localStorage.getItem("token");

    if (token === null || token === "") {
      setLoggedIn(false);

      setLoading(false);

      return;
    }

    fetch(BACKEND_URL + "auth", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        // setcurrentUsername(data.account.user_permissions);
        setLoggedIn(true);
      })
      .catch((error) => {
        alert(error);
      });
    setLoading(false);

    return;
  }

  useEffect(() => {
    getSavedUserInLocalStorage();
  }, []);

  if (loading) {
    return <Loading />;
  }

  //check for username if found in db and check the role for him then direct him to the route

  return (
    <>
      <div className="container-fluid bg-light" style={{ height: "100vh" }}>
        <BrowserRouter>
          <Routes>
            <Route
              path="/"
              element={
                loading ? <Loading /> : loggedIn ? <HomePage /> : <Login />
              }
            />

            <Route path="/excel_reader" element={<ExceReaderPage />} />

            <Route path="/home" element={<HomePage />} />

            <Route path="/tickets" element={<Tickets />} />

            <Route path="/user_tickets" element={<UserTicketsPage />} />

            <Route path="/account-managers" element={<Vendors />} />

            <Route path="/vendors" element={<Vendors />} />

            <Route path="/users" element={<Users />} />

            <Route path="/user_details" element={<UserDetails />} />

            <Route path="/ticket_details" element={<TicketDetails />} />

            <Route path="/vendor_details" element={<VendorDetails />} />

            <Route path="/newticket" element={<NewTicket />} />

            <Route path="/get_report" element={<ReportView />} />

            <Route
              path="/get_new_customers_report"
              element={<GetNewCustomersReportPage />}
            />
            <Route path="/get_hourly_report" element={<HourlyReportPage />} />
            <Route path="/vendor_invoice" element={<VendorInvoiceReport />} />
            <Route
              path="/cancellation_report"
              element={<CancellationReport />}
            />
            <Route
              path="/get_vendor_kpi_report"
              element={<VendorKPIReport />}
            />

            <Route path="/reports" element={<ReportsPage />} />

            <Route path="/login" element={<Login />} />

            <Route path="*" element={<NoPage />} />
          </Routes>
        </BrowserRouter>

        <Footer />
      </div>
    </>
  );
}

export default App;
