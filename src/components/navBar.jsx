import { useEffect } from "react";
import { useState } from "react";
import { Outlet, Link } from "react-router-dom";
import Loading from "./loading";
import { useNavigate } from "react-router-dom";
import { BACKEND_URL } from "../global";

// db password Qymbg5QhNbAzRn!

function NavBar() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [showHome, setShowHome] = useState({ display: "block" });
  const [showTickets, setShowTickets] = useState({ display: "block" });
  const [showVendors, setShowVendors] = useState({ display: "block" });
  const [showUsers, setShowUsers] = useState({ display: "block" });
  const [data, setData] = useState();

  const [userPermissions, setUserPermissions] = useState([]);

  const [customStyle, setCustomStyle] = useState({});

  async function handleLogout() {
    setLoading(true);
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    localStorage.removeItem("username");

    setLoading(false);
    // console.log(showNavBar);
    navigate("/login", { replace: true });
  }

  //get saved token and send it to backend to check its permissions
  async function checkUserPermissions() {
    setLoading(true);
    var token = localStorage.getItem("token");

    await fetch(BACKEND_URL + "auth", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        // console.log(data);
        setData(data);
        setLoading(false);
      })
      .catch((error) => {
        alert(error);
      });
    setLoading(false);
  }

  useEffect(() => {
    checkUserPermissions();
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
      <nav className="navbar navbar-expand-sm navbar-dark bg-light  border-bottom border-primary border-2 rounded p-2">
        <div className="container-fluid">
          <a className="navbar-brand text-primary border border-3 border-primary rounded p-2">
            <Link className="nav-link text-primary" to="/home">
              <h5>
                <b> BALY</b>
              </h5>
            </Link>
          </a>
          <button
            className="navbar-toggler bg-dark"
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
            <ul className="navbar-nav ms-auto">
              <li
                className="nav-item border rounded m-1"
                // style={data?.role === "cc" ? { display: "none" } : {}}
              >
                <Link className="nav-link text-primary" to="/home">
                  <h5>
                    <b>Home </b>
                  </h5>
                </Link>
              </li>

              {/*  */}
              <li
                className="nav-item border rounded m-1"
                style={
                  data?.role === "superuser"
                    ? { display: "block" }
                    : data?.role === "manager"
                    ? { display: "block" }
                    : data?.role === "am"
                    ? { display: "block" }
                    : { display: "none" }
                }
              >
                <Link className="nav-link text-primary" to="/tickets">
                  <h5> Tickets</h5>
                </Link>
              </li>
              {/*  */}
              <li
                className="nav-item border rounded m-1"
                style={{ display: "block" }}
              >
                <Link className="nav-link text-primary" to="/user_tickets">
                  <h5> My Tickets</h5>
                </Link>
              </li>
              {/*  */}
              <li
                className="nav-item border rounded m-1"
                style={{ display: "block" }}
              >
                <Link className="nav-link text-primary" to="/newticket">
                  <h5> New Ticket </h5>
                </Link>
              </li>
              <li
                className="nav-item border rounded m-1"
                style={
                  data?.role === "superuser"
                    ? { display: "block" }
                    : { display: "none" }
                }
              >
                <Link className="nav-link text-primary" to="/users">
                  <h5> Users </h5>
                </Link>
              </li>
              <li
                className="nav-item  border rounded m-1"
                style={
                  data?.role === "superuser"
                    ? { display: "block" }
                    : data?.role === "manager"
                    ? { display: "block" }
                    : data?.role === "am"
                    ? { display: "none" }
                    : { display: "none" }
                }
              >
                <Link className="nav-link text-primary" to="/vendors">
                  <h5> Vendors </h5>
                </Link>
              </li>
              <li className="nav-item border rounded m-1">
                <Link className="nav-link text-primary rounded p-2" to="#">
                  👤<b> {localStorage.getItem("username")}</b>
                </Link>
              </li>
              <li className="nav-item  m-1">
                <Link
                  className="nav-link text-danger rounded p-2 border border-danger"
                  to="/login"
                  onClick={handleLogout}
                >
                  ➡️
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
