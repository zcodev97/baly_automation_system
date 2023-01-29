import { useEffect } from "react";
import { useState } from "react";
import { Outlet, Link } from "react-router-dom";
import Loading from "./loading";
import { useNavigate } from "react-router-dom";

// db password Qymbg5QhNbAzRn!

function timeout(delay) {
  return new Promise((res) => setTimeout(res, delay));
}

function NavBar() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [currentUsername, setCurrentUsername] = useState("");

  var user_type = localStorage.getItem("user_type") ?? "";
  var savedUsername = localStorage.getItem("username") ?? "";
  var username = savedUsername.replaceAll('"', "");
  function getUserType() {
    setCurrentUsername(username);
    if (username.length > 0) {
      return;
    }
  }

  async function handleLogout() {
    setLoading(true);
    localStorage.removeItem("username");
    localStorage.removeItem("password");
    setCurrentUsername("");
    setLoading(false);
    // console.log(showNavBar);
    navigate("/login", { replace: true });
  }

  useEffect(() => {
    getUserType();
  }, []);

  if (loading) {
    return (
      <>
        <Loading />
      </>
    );
  }

  return (
    <>
      <nav className="navbar navbar-expand-sm bg-dark p-2 rounded ">
        <div className="container-fluid">
          <ul className="navbar-nav">
            {/* Divider */}
            <Divider />

            <li className="nav-item ">
              <Link
                // onClick={selectedButtonColor}
                className="text-dark bg-white p-2 rounded"
                to="/"
                style={{ textDecoration: "none", display: "block" }}
              >
                <b> Home 🏠 </b>
              </Link>
            </li>
            <Divider />

            <li className="nav-item ">
              <Link
                className="text-dark bg-white p-2 rounded"
                to="/tickets"
                style={{ textDecoration: "none", display: "block" }}
              >
                <b> Tickets 🎟️ </b>
              </Link>
            </li>

            <Divider />
            <li className="nav-item ">
              <Link
                className="text-dark bg-white p-2 rounded"
                to="/newticket"
                style={{ textDecoration: "none", display: "block" }}
              >
                <b> New Ticket ➕📃</b>
              </Link>
            </li>

            <Divider />
            <li className="nav-item ">
              <Link
                className="text-dark bg-white p-2 rounded"
                to="/users"
                style={{
                  textDecoration: "none",
                  display:
                    user_type === "3" || user_type === "2" ? "none" : "block",
                }}
              >
                <b>Users 👥</b>
              </Link>
            </li>

            {/* <Divider />
            <li className="nav-item ">
              <Link
                className="text-dark bg-white p-2 rounded"
                to="/adduser"
                style={{
                  textDecoration: "none",
                  display:
                    user_type === "3" || user_type === "2" ? "none" : "block",
                }}
              >
                <b> Add User ➕👤</b>
              </Link>
            </li> */}

            <Divider />
            <li className="nav-item ">
              <Link
                className="text-dark bg-white p-2 rounded"
                to="/vendors"
                style={{
                  textDecoration: "none",
                  display:
                    user_type === "3" || user_type === "2" ? "none" : "block",
                }}
              >
                <b> Vendors 🛍️</b>
              </Link>
            </li>

            {/* <Divider />
            <li className="nav-item ">
              <Link
                className="text-dark bg-white p-2 rounded"
                to="/reports"
                style={{
                  textDecoration: "none",
                  display:
                    user_type === "3" || user_type === "2" ? "none" : "block",
                }}
              >
                <b> Reports 📄 </b>
              </Link>
            </li> */}

            <Divider />
            <li className="nav-item ">
              <Link
                className="text-dark bg-white p-2 rounded"
                style={{
                  textDecoration: "none",
                  display: "block",
                }}
              >
                <b> 👤 Current User : {localStorage.getItem("username")}</b>
              </Link>
            </li>
            <Divider />
            <li className="nav-item ">
              <Link
                className="text-dark bg-dark p-2 rounded border-light border-3"
                style={{
                  textDecoration: "none",
                  display: "block",
                }}
              >
                <b className="bg-dark text-light border rounded-pill p-1 ">
                  {" "}
                  {user_type === "3"
                    ? "CC"
                    : user_type === "2"
                    ? "Account Manager"
                    : "Admin"}{" "}
                </b>
              </Link>
            </li>

            <Divider />

            <li className="nav-item ">
              <Link
                className="text-white bg-danger p-2 rounded"
                to="/login"
                style={{ textDecoration: "none", display: "block" }}
                onClick={handleLogout}
              >
                <b> Logout ➡️</b>
              </Link>
            </li>
          </ul>
        </div>
      </nav>

      <Outlet />
    </>
  );
}

function Divider() {
  return (
    <li className="nav-item">
      <div className="container p-1 m-1"></div>
    </li>
  );
}

export default NavBar;
