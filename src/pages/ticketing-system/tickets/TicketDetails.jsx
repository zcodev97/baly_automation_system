import BootstrapTable from "react-bootstrap-table-next";
import { useLocation } from "react-router-dom";
import supabase from "../../../supabase";
import { useNavigate } from "react-router-dom";
import NavBar from "../../../components/navBar";
import { useState } from "react";
import { useEffect } from "react";

function getDate() {
  return new Date().toLocaleString();
}

function TicketDetails() {
  const location = useLocation();
  const navigate = useNavigate();

  const [vendor, setVendor] = useState("");
  const [created, setCreated] = useState(new Date());
  const [issueType, setIssueType] = useState();
  const [orderId, setOrderId] = useState(0);
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("");
  const [status, setStatus] = useState("");
  const [resolveAt, setResolveAt] = useState(new Date());
  const [resolveBy, setResolveBy] = useState("");

  async function updateTicket() {
    console.log(location.state.id);

    const { data, error } = await supabase
      .from("tickets")
      .update({
        status: "resolved",
        resolved_at: getDate(),
        resolved_by: localStorage.getItem("username"),
      })
      .eq("id", location.state.id);

    if (data === null) {
      alert("ticket has been resolved 🤩");
      navigate("/tickets");
    }
  }

  var data = [
    {
      ticket_id: location.state.id,
      created_by: location.state.created_by,
      vendor: location.state.vendor,
      issue_type: location.state.issue_type,
      order_id: location.state.order_id,
      description: location.state.description,
      assign_to: location.state.assign_to,
      priority: location.state.priority,
      status: location.state.status,
      created: location.state.created,
      resolved_at: location.state.resolve_at,
      resolved_by: location.state.resolve_by,
    },
  ];
  const rowStyle = (row, rowIndex) => {
    if (row.status === "pending") {
      return { color: "red" };
    }
    return { color: "green" };
  };

  useEffect(() => {
    setVendor(location.state.vendor);
    setCreated(location.state.created);
    setStatus(location.state.status);
  }, []);

  return (
    <>
      <NavBar />

      <div className="container w-50  text-center p-2 text-white rounded">
        {/*  Vendor */}
        <div className="container border-bottom border-light border-3   m-1 p-1">
          <p className="text-dark">
            <b> Vendor</b>
          </p>
          <input
            value={vendor}
            type="text"
            className="form-control text-center"
            id="uname"
            name="uname"
            required=""
            onChange={(e) => setVendor(e.target.value)}
          />
        </div>
        {/*  Created At */}
        <div className="container border-bottom border-light border-3   m-1 p-1">
          <p className="text-dark">
            <b> Created At</b>
          </p>
          <input
            value={created}
            type="text"
            className="form-control text-center"
            id="uname"
            name="uname"
            required=""
            onChange={(e) => setVendor(e.target.value)}
          />
        </div>
        {/*  Vendor */}
        <div className="container border-bottom border-light border-3   m-1 p-1">
          <p className="text-dark">
            <b> Status</b>
          </p>
          <input
            disabled={true}
            value={status}
            type="text"
            className="form-control text-center"
            id="uname"
            name="uname"
            required=""
            onChange={(e) => setStatus(e.target.value)}
          />
        </div>
      </div>
      <div className="container text-center">
        {data[0].status == "pending" ? (
          <div className="btn btn-success" onClick={updateTicket}>
            Resolve
          </div>
        ) : (
          <div className="btn btn-success disabled">Resolved</div>
        )}
      </div>
    </>
  );
}

const fields = [
  // {
  //   dataField: "ticket_id",
  //   text: "ID",
  // },
  {
    dataField: "vendor",
    text: "Vendor",
  },
  {
    dataField: "created_by",
    text: "Created By",
  },
  {
    dataField: "issue_type",
    text: "Issue Type",
  },
  {
    dataField: "order_id",
    text: "Order ID",
  },
  {
    dataField: "description",
    text: "Description",
  },
  {
    dataField: "assign_to",
    text: "Assign To",
  },

  {
    dataField: "priority",
    text: "Priority",
  },

  {
    dataField: "status",
    text: "Status",
  },
  {
    dataField: "created_at",
    text: "Created At",
  },
  {
    dataField: "resolved_at",
    text: "Resolved At",
  },
  {
    dataField: "resolved_by",
    text: "Resolved By",
  },
];

export default TicketDetails;
