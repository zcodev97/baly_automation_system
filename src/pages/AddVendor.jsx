import { useState } from "react";
import supabase from "../supabase";
import { useNavigate } from "react-router-dom";
import NavBar from "../components/navBar";

function AddVendor() {
  const navigate = useNavigate();

  const [vendorName, setVendorName] = useState("");

  async function AddVendor() {
    let { data: vendors, errorGetVendor } = await supabase
      .from("vendors")
      .select("*")
      .eq("enName", vendorName);

    if (vendors.length > 0) {
      alert("vendor found!! 😕");
      return;
    }

    const { data, error } = await supabase
      .from("vendors")
      .insert([{ enName: vendorName }]);

    if (data === null) {
      alert("new vendor added -->> " + vendorName);
      navigate("/vendors");
    }
  }

  function getVendorName(e) {
    setVendorName(e.target.value);
  }
  return (
    <>
      <NavBar />

      <div className="container w-50 bg-dark rounded">
        <div className="container m-2 p-2">
          <p className="text-white">Vendor Name</p>
          <input
            type="text"
            className="form-control"
            id="uname"
            placeholder="Vendor Name"
            name="uname"
            required=""
            onChange={getVendorName}
          />
        </div>

        <button
          className="btn btn-light m-2 border rounded"
          onClick={AddVendor}
        >
          New Vendor ➕
        </button>
      </div>
    </>
  );
}

export default AddVendor;
