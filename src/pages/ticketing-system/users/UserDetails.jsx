import BootstrapTable from "react-bootstrap-table-next";
import { useLocation } from "react-router-dom";
import cellEditFactory from "react-bootstrap-table2-editor";
import supabase from "../../../supabase";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import NavBar from "../../../components/navBar";
import Select from "react-select";
import Loading from "../../../components/loading";
import BACKEND_URL from "../../../global";

var fields = [
  {
    dataField: "vendor_title",
    text: "Vendor",
  },
];

function UserDetails() {
  const navigate = useNavigate();
  const location = useLocation();

  const [loading, setLoading] = useState("false");

  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [userPermission, setUserPermission] = useState("");
  const [accountManagerVendors, setAccountManagerVendors] = useState([]);

  useEffect(() => {
    setEmail(location.state.email);
    setFirstName(location.state.firstName);
    setLastName(location.state.lastName);
    setPhoneNumber(location.state.phoneNumber);
    setUsername(location.state.username);
    setUserPermission(location.state.role);
  }, []);

  //Issue Type

  const [selectedVendors, setSelectedVendors] = useState([]);
  const [vendors, setVendors] = useState([]);

  let vendorsList = [];

  async function getAllvendors() {
    setLoading(true);
    var token = localStorage.getItem("token");

    let res = await fetch(BACKEND_URL + "ticket_system/all_vendors_user", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    let vendors = await res.json();

    vendors.forEach((vendor) => {
      vendorsList.push({
        label: vendor.vendor_title,
        value: vendor.vendor_title,
      });
    });

    setVendors(vendorsList);

    getAllVendorsForCurrentAccountManager();

    setLoading(false);
  }

  function assignUserToSelectedVendors() {
    setLoading(true);

    var token = localStorage.getItem("token");

    console.log(location.state.id);

    let selectVendorsList = [];

    console.log(selectedVendors);

    // get selected vendors as value
    selectedVendors.forEach((vendor) => {
      selectVendorsList.push(vendor.value);
    });

    fetch(BACKEND_URL + `account_manager/assign_vendors_am`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        account_manager_id: location.state.id,
        vendors: selectVendorsList,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        // console.log(data);

        getAllvendors();
        getAllVendorsForCurrentAccountManager();
        setLoading(false);
      })
      .catch((error) => {
        alert("Error In assign vendors😕");
        setLoading(false);
      });
  }

  function getAllVendorsForCurrentAccountManager() {
    var token = localStorage.getItem("token");

    // console.log(location.state.id);

    if (location.state.id === "" || location.state.id === null) {
      return;
    }

    fetch(
      BACKEND_URL +
        `account_manager/get_vendors_of_am?am_id=${location.state.id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    )
      .then((response) => response.json())
      .then((data) => {
        setAccountManagerVendors(data);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        // alert("Error In getting Account Manager Vendors😕");
        setLoading(false);
      });
  }

  useEffect(() => {
    getAllvendors();
    getAllVendorsForCurrentAccountManager();
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <>
      <NavBar />

      <div className="container-fluid text-center p-2 text-white rounded">
        <div className="row">
          <div className="col-md-6">
            {/*  Username */}
            <div className="container border-bottom border-light border-3   m-1 p-1">
              <p className="text-dark">
                <b> Username</b>
              </p>
              <input
                disabled={true}
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
                disabled={true}
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
                disabled={true}
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
                disabled={true}
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
                disabled={true}
                value={phoneNumber}
                type="text"
                className="form-control text-center"
                id="phone"
                name="phone"
                required=""
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
            </div>
          </div>

          <div className="col-md-6">
            <div className="row">
              <div className="col-md-8">
                {/* vendors */}
                <div className="container border-bottom border-light border-3 text-dark   m-1 p-2">
                  <Select
                    options={vendors}
                    placeholder={"select vendors..."}
                    onChange={(opt) => setSelectedVendors(opt)}
                    isMulti
                  />
                </div>
              </div>
              <div className="col-md-4">
                <div className="container  p-1 text-center">
                  <button
                    className="btn btn-light border border-3 border-success m-1"
                    onClick={assignUserToSelectedVendors}
                  >
                    <b>Assign Vendors </b>
                  </button>
                </div>
              </div>
            </div>

            <div className="container border border-1 rounded bg-dark text-light">
              <div className="container p-1 m-1">
                <h5 className="p-2">User Permissions </h5>
              </div>
              <div className="container text-light p-2">
                {userPermission === null ? "No Permission !" : userPermission}{" "}
              </div>
            </div>
            <hr />
            <div className="container border border-1  rounded bg-dark text-light">
              <div className="container p-1 m-1">
                <h5 className="p-2"> Current Vendors </h5>
              </div>

              {accountManagerVendors.map((vendor, index) => (
                <div
                  className="container m-1 p-1 border rounded"
                  key={vendor.id}
                >
                  {++index} {" - "} {vendor.vendor_title}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default UserDetails;
