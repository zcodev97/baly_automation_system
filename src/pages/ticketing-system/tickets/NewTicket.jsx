import React, { useEffect } from "react";
import { useState } from "react";
import Select from "react-select";
import Loading from "../../../components/loading";
import supabase from "../../../supabase";
import { useNavigate } from "react-router-dom";
import NavBar from "../../../components/navBar";

function NewTicketPage() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState("false");

  var currentUserType = localStorage.getItem("user_type") ?? "";
  var currentUsername = localStorage.getItem("username") ?? "";

  var username = currentUsername.replaceAll('"', "");
  // Vendors
  const [vendors, setVendors] = useState([]);
  const [vendorsDropDownMenu, setVendorsDropDownMenu] = useState([]);

  const [selectedVendor, setSelectedVendor] = useState("");

  //this function is used to control the auto assignement of the vendor to specific account manager
  async function autoAssignAccountManager(selectedVendor) {
    setSelectedVendor(selectedVendor);

    let { data: vendor, error } = await supabase
      .from("vendors")
      .select("*")
      .eq("enName", selectedVendor);

    if (vendor.length > 0) {
      console.log(vendor[0].account_manager);
      setSelectedAccountManager(vendor[0].account_manager);
    }
  }

  let dropVendors = [];

  async function loadVendors() {
    setLoading(true);

    let { data: vendors, error } = await supabase.from("vendors").select("*");
    setVendors(vendors);
    vendors.forEach((vendor) => {
      dropVendors.push({ label: vendor.enName, value: vendor.enName });
    });

    setVendorsDropDownMenu(dropVendors);
    setLoading(false);
  }

  //Issue Type
  const [selectedIssueType, setSelectedIssueType] = useState("");
  const issueType = [{ label: "Payment", value: "Payment" }];

  //order ID
  const [orderId, setOrderId] = useState(0);

  function handleOrderIdInput(e) {
    setOrderId(e.target.value);
  }

  //description
  const [description, setDescription] = useState(0);

  function handleDescriptionInput(e) {
    setDescription(e.target.value);
  }

  //assign to
  const [selectedAccountManager, setSelectedAccountManager] = useState("");

  const [accountManagerDropDown, setAccountManagerDropDown] = useState([]);
  let accountManagersList = [];

  // async function loadAllAccountManagers() {
  //   setLoading(true);

  //   let { data: accountManagersDB, error } = await supabase
  //     .from("users")
  //     .select("*")
  //     .eq("user_type", "2");

  //   accountManagersDB.forEach((accountManager) => {
  //     accountManagersList.push({
  //       label: accountManager.email,
  //       value: accountManager.email,
  //     });
  //   });

  //   setAccountManagerDropDown(accountManagersList);
  //   setLoading(false);
  // }

  //priority
  const [priority, setPriority] = useState([]);
  const priorityDropDown = [
    { label: "low", value: "4" },
    { label: "mid", value: "3" },
    { label: "high", value: "2" },
    { label: "urgent", value: "1" },
  ];

  useEffect(() => {
    loadVendors();
    // loadAllAccountManagers();
  }, []);

  function getDate() {
    return new Date();
  }

  async function addNewTicket() {
    const { data, error } = await supabase.from("tickets").insert([
      {
        created_by: username,
        vendor: selectedVendor,
        issue_type: selectedIssueType,
        order_id: orderId,
        description: description,
        assign_to: selectedAccountManager,
        priority: priority,
        status: "pending",
        created_at: getDate(),
      },
    ]);

    // console.log({
    //   created_by: username,
    //   vendor: selectedVendor,
    //   issue_type: selectedIssueType,
    //   order_id: orderId,
    //   description: description,
    //   assign_to: selectedAccountManager,
    //   priority: priority,
    //   status: "pending",
    //   created_at: getDate(),
    // });

    // console.log(data);
    // console.log(error);

    if (data === null) {
      alert("new ticket added 😁");
      navigate("/tickets");
    }
  }

  //get all vendors
  // async function GetAllVendorsFromDB() {
  //   let token = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwayI6IjczZjExZGI5LTc2ZTQtNDFiYy05ZTk1LTZkZTkwMmJiNDQyMCJ9.uV8tQj6lcTM4JSySi-PkE97qqmacVgNgMjACn2K6Fg0`;

  //   let res = await fetch(
  //     "http://10.11.12.181:8000/api/ticket_system/all_vendors",
  //     {
  //       method: "GET",
  //       headers: {
  //         "Content-Type": "application/json",
  //         Authorization: `Bearer ${token}`,
  //       },
  //     }
  //   );

  //   let jsData = await res.json();
  //   setTickets(jsData);
  //   console.log(jsData);
  // }

  if (loading) {
    return <Loading />;
  }

  return (
    <>
      <NavBar />
      <div className="container text-center border  border-3 bg-dark mt-2 p-3 w-50 rounded">
        {/* vendor name */}
        <div className="container border-bottom border-light border-3  p-2">
          <p className="text-white">Vendor</p>
          <Select
            options={vendorsDropDownMenu}
            // onChange={(opt) => setSelectedVendor(opt.value)}
            onChange={(opt) => autoAssignAccountManager(opt.value)}
            // isMulti
          />
        </div>

        {/* issue type */}
        <div className="container border-bottom border-light border-3   m-1 p-2">
          <p className="text-white">Issue Type</p>
          <Select
            options={issueType}
            onChange={(opt) => setSelectedIssueType(opt.value)}
            // isMulti
          />
        </div>

        {/* order ID */}
        <div className="container border-bottom border-light border-3   m-2 p-2">
          <p className="text-white">Order ID</p>
          <input
            type="number"
            className="form-control"
            id="uname"
            placeholder="Order ID ex...1532"
            name="uname"
            required=""
            onChange={handleOrderIdInput}
          />
        </div>

        {/* Description */}
        <div className="container border-bottom border-light border-3   m-2 p-2">
          <div className="form-group">
            <label htmlFor="comment" className="text-white">
              Description:
            </label>
            <textarea
              className="form-control"
              rows={5}
              id="comment"
              defaultValue={""}
              onChange={handleDescriptionInput}
            />
          </div>
        </div>

        {/* Assign To */}
        <div className="container border-bottom border-light border-3   m-1 p-2">
          <p className="text-white">Account Manager</p>
          {/* <Select
            isDisabled={true}
            options={accountManagerDropDown}
            label={selectedAccountManager}
            value={selectedAccountManager}
            onChange={(opt) => setSelectedAccountManager(opt.value)}
            isMulti
          /> */}
          <div className="container text-center text-dark bg-light  ">
            {selectedAccountManager}
          </div>
        </div>

        {/* Priority */}
        <div className="container border-bottom border-light border-3   m-1 p-2">
          <p className="text-white">Priority</p>
          <Select
            options={priorityDropDown}
            onChange={(opt) => setPriority(opt.value)}
            // isMulti
          />
        </div>

        {/* upload File Button */}
        {/* <div className="container m-1 p-2">
          <p className="text-white">Choose File (Optional).</p>
          <div className="form-group text-white">
            <input
              type="file"
              className="form-control-file border"
              name="file"
            />
          </div>
        </div> */}

        {/* Submit Ticket Button */}
        <div className="container mt-2 text-center">
          <button
            type="button"
            className="btn btn-primary"
            onClick={addNewTicket}
          >
            Submit Ticket
          </button>
        </div>
      </div>
    </>
  );
}

export default NewTicketPage;
