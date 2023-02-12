import { useEffect } from "react";
import { useState } from "react";
import { Outlet, Link } from "react-router-dom";
import Loading from "./loading";
import { useNavigate } from "react-router-dom";

// db password Qymbg5QhNbAzRn!

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
    localStorage.removeItem("token");

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
      <nav className="navbar navbar-expand-sm navbar-dark bg-light border-primary border border-4 rounded p-2">
        <div className="container-fluid">
          <a className="navbar-brand text-primary" href="#">
            BALY
          </a>
          <button
            className="navbar-toggler"
            type="button"
            data-toggle="collapse"
            data-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ">
              <li className="nav-item">
                <Link className="nav-link text-primary" to="/">
                  Home 🏠
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link text-primary" to="/tickets">
                  Tickets 🎟️
                </Link>
              </li>
              <li
                className="nav-item"
                style={{
                  display: "block",
                }}
              >
                <Link className="nav-link text-primary" to="/users">
                  Users 👥
                </Link>
              </li>
              <li
                className="nav-item"
                style={{
                  display: "block",
                }}
              >
                <Link className="nav-link text-primary" to="/vendors">
                  Vendors 🛍️
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link text-primary rounded p-2" to="#">
                  👤<b> {localStorage.getItem("username")}</b>
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className="nav-link text-danger rounded p-2"
                  to="/login"
                  onClick={handleLogout}
                >
                  Logout ➡️
                </Link>
              </li>
            </ul>
          </div>
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
