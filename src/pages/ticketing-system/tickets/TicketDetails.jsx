import BootstrapTable from "react-bootstrap-table-next";
import { useLocation } from "react-router-dom";
import supabase from "../../../supabase";
import { useNavigate } from "react-router-dom";
import NavBar from "../../../components/navBar";
import { useState } from "react";
import { useEffect } from "react";
import { BACKEND_URL } from "../../../global";
import Select from "react-select";
import Loading from "../../../components/loading";

function getDate() {
  return new Date().toLocaleString();
}

function TicketDetails() {
  const location = useLocation();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

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
  const [commentMessage, setCommentMessage] = useState("");

  const [users, setUsers] = useState([]);
  const [usersDropDownMenu, setUsersDropDownMenu] = useState([]);

  let usersList = [];

  const [selectedUser, setSelectedUser] = useState("");

  async function resolveTicket() {
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
        if (data.detail) {
          alert(data.detail);
          return;
        }
        // console.log(data);
        alert("ticket resolved 😁");
        navigate("/tickets");
      })
      .catch((error) => {
        alert("Error In Resolving Tickets 😕");
      });
  }

  async function addComment() {
    if (commentMessage.length === 0) {
      alert("please add a comment 😕");
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
        if (
          data.detail === "you do not have permission to comment on this ticket"
        ) {
          alert("You Don't Have Permission To Comment on This Ticket");
          return;
        }
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
        setCommentMessage("");
        setComments(data);
      })
      .catch((error) => {
        alert("Error In getting Comments 😕");
      });
  }

  //get all users
  async function getAllUsers() {
    setLoading(true);

    var token = localStorage.getItem("token");

    let res = await fetch(BACKEND_URL + `ticket_system/all_users`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    let data = await res.json();

    if (data.detail) {
      alert(data.detail);
      setLoading(false);

      return;
    }

    setUsers(data);

    setLoading(false);
  }

  //reassign ticket to new  user

  async function reassignTicket() {
    setLoading(true);

    var token = localStorage.getItem("token");

    fetch(
      BACKEND_URL +
        `ticket_system/reassign_ticket?ticket_id=${ticketId}&assign_user_id=${selectedUser?.value}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    )
      .then((response) => response.json())
      .then((data) => {
        if (data.detail) {
          alert(data.detail);
          // navigate("/user_tickets");
          setAssignTo(selectedUser.label);
          setLoading(false);
          return;
        }
        console.log(data);
        setLoading(false);
      })
      .catch((error) => {
        alert(error);
        setLoading(false);
      });
  }

  useEffect(() => {
    setTicketId(location.state.id);
    setVendor(location.state.vendor);
    setCreated(location.state.created_at);
    setCreatedBy(location.state.created_by);
    setResolveAt(location.state.resolve_at);
    setResolveBy(location.state.resolve_by);
    setIssueType(location.state.issue_type);
    setOrderId(location.state.order_id);
    setDescription(location.state.description);
    setAssignTo(location.state.assign_to);
    setPriority(location.state.priority);
    setStatus(location.state.status);
    setComments(location.state.comments);
  }, []);

  useEffect(() => {
    getAllUsers();
  }, []);
  useEffect(() => {
    users.forEach((user) => {
      usersList.push({
        label: user.username,
        value: user.id,
      });
    });

    setUsersDropDownMenu(usersList);
  }, [users]);

  if (loading) {
    return <Loading />;
  }

  return (
    <>
      <NavBar />
      <div className="container p-2 mt-2   border-2 border-bottom border-primary text-dark rounded">
        <h3 className="text-center">
          Ticket Details / Assigned To{" "}
          <b className="text-danger"> {assignTo} </b>
        </h3>
      </div>

      <div className="container-fluid  p-2 text-center p-1 mt-1 text-white border rounded">
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
            {/*   resolveAt */}
            {widgetView(
              "resolveAt",

              new Date(resolveAt).toLocaleDateString() ===
                new Date("1/1/1970").toLocaleDateString()
                ? ""
                : new Date(resolveAt).toLocaleDateString() +
                    " " +
                    new Date(resolveAt).toLocaleTimeString()
            )}
            {/*   resolveBy */}
            {widgetView("resolveBy", resolveBy)}
            {/*   orderId */}
            {widgetView("orderId", orderId)}
          </div>
          <div className="col-md-4">
            {/*   priority */}
            {widgetView("priority", priority)}
            {/*   issueType */}
            {widgetView("issueType", issueType)}
            {/*   Status */}
            {widgetView("Status", status)}

            <div className="container border-bottom  border-1 ">
              <p className="text-dark">
                <b> description </b>
              </p>
              <input
                style={{ height: 200 }}
                disabled
                value={description}
                type="text"
                className="form-control text-center"
                id="uname"
                name="uname"
                required=""
                // onChange={(e) => setVendor(e.target.value)}
              />
            </div>
          </div>
          <div className="col-md-4">
            <div className="container bg-light border p-3 mt-2 rounded">
              <div className="row">
                <div className="col-md-9">
                  <input
                    placeholder="your commnet..."
                    type="text"
                    className="form-control text-center"
                    id="uname"
                    name="uname"
                    onChange={(e) => setCommentMessage(e.target.value)}
                  />
                </div>
                <div className="col-md-3">
                  <button
                    className="btn btn-primary border rounded"
                    onClick={async () => {
                      await addComment();
                    }}
                  >
                    Add Comment
                  </button>
                </div>
              </div>
            </div>

            <div className="container p-2 text-start bg-light text-dark rounded mt-1">
              <h5> Comments : </h5>

              <div className="">
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
      </div>

      <div className="row d-flex align-items-center justify-content-center bg-light  m-2">
        <div className="col-md-2"></div>

        <div className="col-md-2">
          {/* assign new user for current ticket  */}
          <div className="container text-dark border-bottom border-light border-3  p-2">
            <b className="text-dark">Assign New User :</b>
            <Select
              options={usersDropDownMenu}
              onChange={(opt) => setSelectedUser(opt)}
            />
          </div>
        </div>

        <div className="col-md-2">
          <div className="container text-center mt-3">
            <div
              className="btn btn-primary"
              onClick={async () => {
                await reassignTicket();
              }}
            >
              <b>Re-assign </b>
            </div>
          </div>
        </div>

        <div className="col-md-2">
          <div className="container text-center mt-3">
            {status == "Pending" ? (
              <div className="btn btn-success" onClick={resolveTicket}>
                Resolve
              </div>
            ) : (
              <div className="btn btn-success disabled">Resolved</div>
            )}
          </div>
        </div>
        <div className="col-md-4"></div>
      </div>
    </>
  );
}

function widgetView(title, value) {
  return (
    <>
      <div className="container border-1 ">
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
