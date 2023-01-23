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

    let accountManager = accountMangersArray.find(function (element) {
      return element.key === selectedVendor;
    });

    setSelectedAccountManager(accountManager.value);
  }

  let dropVendors = [];

  let accountManagers = [];

  const [accountMangersArray, setAccountManagerArray] = useState([]);

  async function loadVendors() {
    setLoading(true);

    let token = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwayI6IjhmNWZlZjVjLTM4ZGUtNGI2YS1hNTE4LTNkZWY0YWE5MGM0MyJ9.DIuzjjlcRf7Jr-pUPHJl08OJnxzr4UE-zi6C_GbzbNg`;

    let res = await fetch(
      "http://django-env-v1.eba-cveq8rvb.us-west-2.elasticbeanstalk.com/api/ticket_system/all_vendors_user",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    let vendors = await res.json();

    setVendors(vendors);
    vendors.forEach((vendor) => {
      dropVendors.push({
        label: vendor.vendor_title,
        value: vendor.vendor_title,
      });
      accountManagers.push({
        key: vendor.vendor_title,
        value: vendor.username,
      });
    });
    setAccountManagerArray(accountManagers);
    setVendorsDropDownMenu(dropVendors);
    setLoading(false);
  }

  //Issue Type

  const [selectedIssueType, setSelectedIssueType] = useState("");
  const [issueTypes, setIssueTypes] = useState([]);

  let issueTypesList = [];

  //get all issue
  async function GetAllIssueTypes() {
    setLoading(true);

    let token = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwayI6IjhmNWZlZjVjLTM4ZGUtNGI2YS1hNTE4LTNkZWY0YWE5MGM0MyJ9.DIuzjjlcRf7Jr-pUPHJl08OJnxzr4UE-zi6C_GbzbNg`;

    let res = await fetch(
      "http://django-env-v1.eba-cveq8rvb.us-west-2.elasticbeanstalk.com/api/ticket_system/all_issue_types",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    let issueTypes = await res.json();

    issueTypes.forEach((issue) => {
      issueTypesList.push({
        label: issue.title,
        value: issue.id,
      });
    });

    setIssueTypes(issueTypesList);

    console.log(issueTypes);

    setLoading(false);
  }

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
  const [selectedAccountManager, setSelectedAccountManager] = useState(null);

  //priority
  const [priority, setPriority] = useState([]);
  const priorityDropDown = [
    { label: "Low", value: "Low" },
    { label: "Medium", value: "Medium" },
    { label: "High", value: "High" },
    { label: "Urgent", value: "Urgent" },
  ];

  useEffect(() => {
    GetAllIssueTypes();
    loadVendors();
    // loadAllAccountManagers();
  }, []);

  function getDate() {
    return new Date();
  }

  async function addNewTicket() {
    let token = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwayI6IjhmNWZlZjVjLTM4ZGUtNGI2YS1hNTE4LTNkZWY0YWE5MGM0MyJ9.DIuzjjlcRf7Jr-pUPHJl08OJnxzr4UE-zi6C_GbzbNg`;

    console.log({
      user_assign_to: selectedAccountManager,
      issue_type: selectedIssueType,
      vendor: selectedVendor,
      order_id: orderId,
      description: description,
      comment: "",
      priority: priority,
    });

    fetch(
      "http://django-env-v1.eba-cveq8rvb.us-west-2.elasticbeanstalk.com/api/ticket_system/create_ticket",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },

        body: JSON.stringify({
          user_assign_to: selectedAccountManager,
          issue_type: selectedIssueType,
          vendor: selectedVendor,
          order_id: orderId,
          description: description,
          comment: "",
          priority: priority,
        }),
      }
    )
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        alert("new ticket added 😁");
        navigate("/tickets");
      })
      .catch((error) => {
        alert("Error In Adding new ticket 😕");
      });
  }

  if (loading) {
    return <Loading />;
  }

  return (
    <>
      <NavBar />
      <div className="container text-center border  border-3 bg-dark mt-2 p-3 w-50 rounded">
        {/* vendor name */}
        <div className="container border-bottom border-light border-3  p-2">
          <b className="text-white">Vendor</b>
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
            options={issueTypes}
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
