import Tickets from "./pages/ticketing-system/tickets/Tickets";
import "./App.css";
import NewTicket from "./pages/ticketing-system/tickets/NewTicket";
import Footer from "./components/footer";
import NoPage from "./pages/NoPage";
import Login from "./pages/Login";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import supabase from "./supabase";
import { useEffect, useState } from "react";
import TicketDetails from "./pages/ticketing-system/tickets/TicketDetails";
import Loading from "./components/loading";
import { Vendors } from "./pages/Vendors";
import VendorDetails from "./pages/VendorDetails";
import { Users } from "./pages/ticketing-system/users/Users";
import AddUser from "./pages/ticketing-system/users/AddUser";
import UserDetails from "./pages/ticketing-system/users/UserDetails";
import AddVendor from "./pages/AddVendor";
import ReportView from "./pages/ReportView";
import ReportsPage from "./pages/Reports";
import MostSellingItemsPerVendor from "./pages/MostSellingItemsPerVendor";
import HomePage from "./pages/Home";
import GetNewCustomersReportPage from "./pages/reports/GetNewCustomers";

function App() {
  const [savedUser, setSavedUser] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentUsername, setcurrentUsername] = useState("");

  var savedUsername = localStorage.getItem("username") ?? "";
  var savedPassword = localStorage.getItem("password") ?? "";
  var user_type = localStorage.getItem("user_type") ?? "";
  // var checked = localStorage.getItem("checked") ?? "";

  var username = savedUsername.replaceAll('"', "");
  var password = savedPassword.replaceAll('"', "");

  async function getSavedUserInLocalStorage() {
    setLoading(true);
    if (username.length > 0) {
      let { data: user, error } = await supabase
        .from("users")
        .select("*")
        .eq("email", username)
        .eq("password", password);

      if (user.length > 0) {
        // console.log(user);
        setcurrentUsername(user[0].email);
        setSavedUser(user);
        setLoading(false);
        return;
      }
    }

    setcurrentUsername("");
    setLoading(false);
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
        <>
          <BrowserRouter>
            <Routes>
              <Route
                path="/"
                element={currentUsername.length > 0 ? <HomePage /> : <Login />}
              />

              <Route path="/home" element={<HomePage />} />

              <Route path="/tickets" element={<Tickets />} />

              <Route path="/account-managers" element={<Vendors />} />

              <Route path="/vendors" element={<Vendors />} />

              <Route path="/addvendor" element={<AddVendor />} />

              <Route path="/users" element={<Users />} />

              <Route path="/user_details" element={<UserDetails />} />

              <Route path="/ticket_details" element={<TicketDetails />} />

              <Route path="/vendor_details" element={<VendorDetails />} />

              <Route path="/newticket" element={<NewTicket />} />

              <Route path="/adduser" element={<AddUser />} />

              <Route path="/get_report" element={<ReportView />} />

              <Route
                path="/get_new_customers_report"
                element={<GetNewCustomersReportPage />}
              />

              <Route
                path="/most_selling"
                element={<MostSellingItemsPerVendor />}
              />

              <Route path="/reports" element={<ReportsPage />} />

              <Route path="/login" element={<Login />} />

              <Route path="*" element={<NoPage />} />
            </Routes>
          </BrowserRouter>

          <Footer />
        </>
      </div>
    </>
  );
}

export default App;
