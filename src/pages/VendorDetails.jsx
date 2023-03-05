import { useState } from "react";
import BootstrapTable from "react-bootstrap-table-next";
import { useLocation } from "react-router-dom";
import Select from "react-select";
import supabase from "../supabase";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import Loading from "../components/loading";
import NavBar from "../components/navBar";
import { BACKEND_URL } from "../global";

function VendorDetails({ id }) {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [newVendorName, setNewVendorName] = useState("");

  const [selectedAccountManager, setSelectedAccountManager] = useState("");

  const [accountManagerDropDown, setAccountManagerDropDown] = useState([]);
  let accountManagersList = [];

  const location = useLocation();

  const fields = [
    {
      dataField: "account_manager_username",
      text: "Account Manager Username",
    },

    {
      dataField: "vendor_title",
      text: "Vendor Title",
    },
  ];

  var data = [
    {
      id: location.state.id,
      account_manager_id: location.state.account_manager_id,
      account_manager_username: location.state.account_manager_username,
      vendor_title: location.state.vendor_title,
    },
  ];

  async function loadAllAccountManagers() {
    setLoading(true);

    var token = localStorage.getItem("token");

    let res = await fetch(BACKEND_URL + "account_manager/all_am", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    let accountManagers = await res.json();

    accountManagers.forEach((accountManager) => {
      accountManagersList.push({
        label: accountManager.username,
        value: accountManager.id,
      });
    });

    setAccountManagerDropDown(accountManagersList);
    setLoading(false);
  }

  async function updateVendorAccountManager() {
    setLoading(true);

    var token = localStorage.getItem("token");

    let res = null;
    fetch(BACKEND_URL + `account_manager/assign_vendor_am`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        account_manager_id: selectedAccountManager,
        vendor: data[0].vendor_title,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        res = data;
        navigate("/vendors");
      })
      .catch((error) => {
        console.log(error);
        alert("Error In Updating Vendor 😕");
      });

    if (res !== null) {
      alert(
        "account manager for vendor " +
          location.state.vendor_title +
          " updated "
      );
    }
    setLoading(false);
  }

  useEffect(() => {
    loadAllAccountManagers();
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <>
      <NavBar />

      <div className="container text-center p-2 text-white rounded">
        <BootstrapTable bootstrap4 keyField="id" columns={fields} data={data} />
      </div>

      <div className="container m-1"></div>

      <div className="container  w-50 p-2 bg-dark rounded">
        <p className="text-white">
          Current Assigned to <b> {location.state.account_manager_username} </b>
        </p>
        <p className="text-white">Assign To</p>
        <Select
          options={accountManagerDropDown}
          onChange={(opt) => {
            setSelectedAccountManager(opt.value);
          }}
          // isMulti
        />
        <div
          className="btn btn-success m-2"
          onClick={updateVendorAccountManager}
        >
          Update Account Manager
        </div>
      </div>
    </>
  );
}

export default VendorDetails;
