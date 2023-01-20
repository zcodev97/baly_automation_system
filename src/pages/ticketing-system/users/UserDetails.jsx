import BootstrapTable from "react-bootstrap-table-next";
import { useLocation } from "react-router-dom";
import cellEditFactory from "react-bootstrap-table2-editor";
import supabase from "../../../supabase";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import NavBar from "../../../components/navBar";

var fields = [
  // {
  //   dataField: "id",
  //   text: "ID",
  // },
  {
    dataField: "email",
    text: "Email",
  },
  {
    dataField: "user_type",
    text: "User Type",
  },
  {
    dataField: "is_active",
    text: "Is Active",
  },
  {
    dataField: "created_at",
    text: "Create At",
  },
];

function UserDetails() {
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [userPermission, setUserPermission] = useState([]);

  async function deacitveUser() {
    // const { data, error } = await supabase
    //   .from("users")
    //   .update({ is_active: false })
    //   .eq("id", location.state.id);
    // if (data === null) {
    //   alert("user has been deactivated successfully");
    //   navigate("/users");
    // }
  }

  async function deleteUser() {
    // const { data, error } = await supabase
    //   .from("users")
    //   .delete()
    //   .eq("id", location.state.id);
    // if (data === null) {
    //   alert("user has been deleted successfully");
    //   navigate("/users");
    // }
  }

  useEffect(() => {
    setEmail(location.state.email);
    setFirstName(location.state.firstName);
    setLastName(location.state.lastName);
    setPhoneNumber(location.state.phoneNumber);
    setUsername(location.state.username);
    setUserPermission(location.state.userPermissions);
  }, []);

  return (
    <>
      <NavBar />

      <div className="container w-50 text-center p-2 text-white rounded">
        {/*  Username */}
        <div className="container border-bottom border-light border-3   m-1 p-1">
          <p className="text-dark">
            <b> Username</b>
          </p>
          <input
            value={username}
            type="text"
            className="form-control text-center"
            id="uname"
            name="uname"
            required=""
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        {/*  Email */}
        <div className="container border-bottom border-light border-3   m-1 p-1">
          <p className="text-dark">
            <b> Email</b>
          </p>
          <input
            value={email}
            type="text"
            className="form-control text-center "
            id="email"
            name="email"
            required=""
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        {/*  firstName */}
        <div className="container border-bottom border-light border-3   m-1 p-1">
          <p className="text-dark">
            <b> First Name</b>
          </p>
          <input
            value={firstName}
            type="text"
            className="form-control text-center"
            id="firstname"
            name="firstname"
            required=""
            onChange={(e) => setFirstName(e.target.value)}
          />
        </div>

        {/*  lastname */}
        <div className="container border-bottom border-light border-3   m-1 p-1">
          <p className="text-dark">
            <b> Last Name</b>
          </p>
          <input
            value={lastName}
            type="text"
            className="form-control text-center"
            id="lastname"
            name="lastname"
            required=""
            onChange={(e) => setLastName(e.target.value)}
          />
        </div>

        {/*  phonenumber */}
        <div className="container border-bottom border-light border-3   m-1 p-1">
          <p className="text-dark">
            <b> Phone Number</b>
          </p>
          <input
            value={phoneNumber}
            type="text"
            className="form-control text-center"
            id="phone"
            name="phone"
            required=""
            onChange={(e) => setPhoneNumber(e.target.value)}
          />
        </div>

        <div className="container text-dark">
          User Permissions
          <ul>
            {userPermission.map((item) => (
              <li key={location.state.id}>{item.name}</li>
            ))}
          </ul>
        </div>

        <div className="container m-1 p-1 text-center">
          <button className="btn btn-danger m-1" onClick={deacitveUser}>
            Deacitve User
          </button>
          <button className="btn btn-danger m-1" onClick={deleteUser}>
            Delete User
          </button>
        </div>
      </div>
    </>
  );
}

export default UserDetails;
