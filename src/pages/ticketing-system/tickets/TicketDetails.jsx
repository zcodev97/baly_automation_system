import BootstrapTable from "react-bootstrap-table-next";
import { useLocation } from "react-router-dom";
import supabase from "../../../supabase";
import { useNavigate } from "react-router-dom";
import NavBar from "../../../components/navBar";
import { useState } from "react";
import { useEffect } from "react";
import { BACKEND_URL } from "../../../global";

function getDate() {
  return new Date().toLocaleString();
}

function TicketDetails() {
  const location = useLocation();
  const navigate = useNavigate();

  const [ticketId, setTicketId] = useState("");
  const [vendor, setVendor] = useState("");
  const [created, setCreated] = useState(new Date());
  const [createdBy, setCreatedBy] = useState(new Date());
  const [issueType, setIssueType] = useState();
  const [orderId, setOrderId] = useState(0);
  const [assignTo, setAssignTo] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("");
  const [status, setStatus] = useState("");
  const [resolveAt, setResolveAt] = useState(new Date());
  const [resolveBy, setResolveBy] = useState("");
  const [comments, setComments] = useState([]);
  const [commentMessage, setCommentMessage] = useState([]);

  async function updateTicket() {
    var token = localStorage.getItem("token");

    fetch(BACKEND_URL + `ticket_system/resolve_ticket?ticket_id=${ticketId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        alert("ticket resolved 😁");
        navigate("/tickets");
      })
      .catch((error) => {
        alert("Error In Resolving Tickets 😕");
      });
  }

  const rowStyle = (row, rowIndex) => {
    if (row.status === "pending") {
      return { color: "red" };
    }
    return { color: "green" };
  };

  async function addComment() {
    if (commentMessage.length === 0) {
      alert("please add some text to your comment 😕");
      return;
    }
    var token = localStorage.getItem("token");

    fetch(
      BACKEND_URL +
        `ticket_system/add_comment_ticket?ticket_id=${ticketId}&comment=${commentMessage}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    )
      .then((response) => response.json())
      .then(async (data) => {
        await getComments();
      })
      .catch((error) => {
        alert("Error In Adding new Comment 😕");
      });
  }
  async function getComments() {
    var token = localStorage.getItem("token");

    fetch(
      BACKEND_URL + `ticket_system/get_comments_ticket?ticket_id=${ticketId}`,
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
        setComments(data);
      })
      .catch((error) => {
        alert("Error In getting Comments 😕");
      });
  }

  useEffect(() => {
    setTicketId(location.state.id);
    setVendor(location.state.vendor);
    setCreated(location.state.created_at);
    setCreatedBy(location.state.created_by);
    setResolveAt(location.state.resolved_at);
    setResolveBy(location.state.resolved_by);
    setIssueType(location.state.issue_type);
    setOrderId(location.state.order_id);
    setDescription(location.state.description);
    setAssignTo(location.state.assign_to);
    setPriority(location.state.priority);
    setStatus(location.state.status);
    setComments(location.state.comments);

    console.log();
  }, []);

  return (
    <>
      <NavBar />
      <div className="container p-2 mt-2   border-2 border-bottom border-primary text-dark rounded">
        <h3 className="text-center">
          <b> Ticket Details</b>{" "}
        </h3>
      </div>

      <div className="container   text-center p-1 text-white rounded">
        <div className="row">
          <div className="col-md-4">
            {/*  Vendor */}
            {widgetView("Vendor", vendor)}
            {/*   Created At */}
            {widgetView(
              "Created At",
              new Date(created).toLocaleDateString() +
                " " +
                new Date(created).toLocaleTimeString()
            )}
            {/*   createdBy */}
            {widgetView("Created By", createdBy)}
          </div>
          <div className="col-md-4">
            {/*   resolveAt */}
            {widgetView(
              "resolveAt",

              new Date(resolveAt) < new Date()
                ? ""
                : new Date(resolveAt).toLocaleDateString() +
                    " " +
                    new Date(resolveAt).toLocaleTimeString()
            )}
            {/*   resolveBy */}
            {widgetView("resolveBy", resolveBy)}
            {/*   orderId */}
            {widgetView("orderId", orderId)}
            {/*   description */}
            {widgetView("description", description)}
          </div>
          <div className="col-md-4">
            {/*   priority */}
            {widgetView("priority", priority)}
            {/*   issueType */}
            {widgetView("issueType", issueType)}
            {/*   Status */}
            {widgetView("Status", status)}
          </div>
        </div>

        <div className="container bg-light border p-3 mt-2 rounded">
          <div className="row">
            <div className="col-md-10">
              <input
                placeholder="your commnet..."
                type="text"
                className="form-control text-center"
                id="uname"
                name="uname"
                onChange={(e) => setCommentMessage(e.target.value)}
              />
            </div>
            <div className="col-md-2">
              <button
                className="btn btn-primary border rounded"
                onClick={async () => {
                  await addComment();
                }}
              >
                Add Comment ✅
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="container-fluid bg-light rounded">
        <div className="container p-2 text-start bg-dark text-light rounded">
          <h5> Comments : </h5>

          <div className="container  text-center bg-light rounded p-2 mt-2">
            <div className="text-dark">
              {comments.slice(1).length !== 0 ? (
                comments.slice(1).map((item) => (
                  <>
                    <li
                      key={Math.floor(Math.random() * 10000)}
                      className="list-group-item   border border-2 p-2 m-1 rounded"
                    >
                      [ <b> Date : </b>
                      {new Date(item.created).toLocaleDateString()} {"   "}
                      <b>Time : </b>:{" "}
                      {new Date(item.created).toLocaleTimeString()} ] {"  "}
                      <b>
                        {item.comment_by.username} : {item.content}
                      </b>
                    </li>
                    <hr />
                  </>
                ))
              ) : (
                <div className="container bg-primary rounded text-light">
                  No Comments
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container text-center mt-3">
        {status == "Pending" ? (
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

function widgetView(title, value) {
  return (
    <>
      <div className="container border-bottom  border-1 ">
        <p className="text-dark">
          <b> {title} </b>
        </p>
        <input
          disabled
          value={value}
          type="text"
          className="form-control text-center"
          id="uname"
          name="uname"
          required=""
          // onChange={(e) => setVendor(e.target.value)}
        />
      </div>
    </>
  );
}

export default TicketDetails;
