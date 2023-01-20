import { useState } from "react";
import BootstrapTable from "react-bootstrap-table-next";
import { useLocation } from "react-router-dom";
import Select from "react-select";
import supabase from "../supabase";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import Loading from "../components/loading";
import NavBar from "../components/navBar";

function VendorDetails({ id }) {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [newVendorName, setNewVendorName] = useState("");

  const [selectedAccountManager, setSelectedAccountManager] = useState("");

  const [accountManagerDropDown, setAccountManagerDropDown] = useState([]);
  let accountManagersList = [];

  const location = useLocation();

  const fields = [
    // {
    //   dataField: "id",
    //   text: "ID",
    // },
    {
      dataField: "enName",
      text: "Vendor",
    },
  ];

  var data = [
    {
      id: location.state.id,
      enName: location.state.enName,
      account_manager: location.state.account_manager,
    },
  ];

  async function loadAllAccountManagers() {
    setLoading(true);

    let { data: accountManagersDB, error } = await supabase
      .from("users")
      .select("*")
      .eq("user_type", "2");

    accountManagersDB.forEach((accountManager) => {
      accountManagersList.push({
        label: accountManager.email,
        value: accountManager.email,
      });
    });

    setAccountManagerDropDown(accountManagersList);
    setLoading(false);
  }

  async function handleDeleteAction() {
    const { data, error } = await supabase
      .from("vendors")
      .delete()
      .eq("id", location.state.id);

    if (data === null) {
      alert("vendor has been deleted 😕");
      navigate("/vendors");
    }
  }

  function handleNewVendorName(e) {
    setNewVendorName(e.target.value);
  }

  async function handleUpdateVendorName() {
    const { data, error } = await supabase
      .from("vendors")
      .update({ enName: newVendorName })
      .eq("id", location.state.id);

    if (data === null) {
      alert("vendor name has been updated 😁");
      navigate("/vendors");
    }
  }

  async function updateVendorAccountManager() {
    const { data, error } = await supabase
      .from("vendors")
      .update({ account_manager: selectedAccountManager })
      .eq("id", location.state.id);

    if (data === null) {
      alert(
        "account manager for vendor " +
          location.state.enName +
          " updated to " +
          selectedAccountManager +
          " 😁"
      );
      navigate("/vendors");
    }
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

      <div className="container  w-50  p-2 bg-dark rounded">
        <div className="container m-2 p-2">
          <p className="text-white">New Vendor Name</p>
          <input
            type="email"
            className="form-control"
            id="uname"
            placeholder="New Vendor Name"
            name="uname"
            required=""
            onChange={handleNewVendorName}
          />
        </div>
        <div className="btn btn-success m-2" onClick={handleUpdateVendorName}>
          Update Vendor Name
        </div>
      </div>
      <div className="container m-1"></div>

      <div className="container  w-50 p-2 bg-dark rounded">
        <p className="text-white">
          Current Assigned to <b> {location.state.account_manager} </b>
        </p>
        <p className="text-white">Assign To</p>
        <Select
          options={accountManagerDropDown}
          onChange={(opt) => setSelectedAccountManager(opt.value)}
          // isMulti
        />
        <div
          className="btn btn-success m-2"
          onClick={updateVendorAccountManager}
        >
          Update Account Manager
        </div>
        <div className="btn btn-danger" onClick={handleDeleteAction}>
          Delete Vendor
        </div>
      </div>
    </>
  );
}

export default VendorDetails;
