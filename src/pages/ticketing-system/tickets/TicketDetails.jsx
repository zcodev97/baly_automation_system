import BootstrapTable from "react-bootstrap-table-next";
import { useLocation } from "react-router-dom";
import supabase from "../../../supabase";
import { useNavigate } from "react-router-dom";
import NavBar from "../../../components/navBar";
import { useState } from "react";
import { useEffect } from "react";
import BACKEND_URL from "../../../global";

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
      .then((data) => {
        // console.log(data);

        getComments();

        // alert("new comment   added 😁");
        // navigate("/tickets");
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
        setComments([]);
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
  }, []);

  return (
    <>
      <NavBar />

      <div className="container   text-center p-1 text-white rounded">
        <div className="row">
          <div className="col-md-4">
            {/*  Vendor */}
            {widgetView("Vendor", vendor)}
            {/*   Created At */}
            {widgetView("Created At", created)}
            {/*   createdBy */}
            {widgetView("Created By", createdBy)}
          </div>
          <div className="col-md-4">
            {/*   resolveAt */}
            {widgetView("resolveAt", resolveAt)}
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
              <p className="text-dark ">
                <b
                  className="btn btn-primary border rounded"
                  onClick={addComment}
                >
                  Add Comment ✅
                </b>
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="container w-50  bg-light text-center rounded">
        <b> Comments :</b>

        <div className="container text-center p-2 mt-2">
          <div className="text-dark">
            {comments.length > 0
              ? comments.map((item) => (
                  <li
                    key={Math.floor(Math.random() * 10000)}
                    className="list-group-item   border border-2 p-2 m-1 rounded"
                  >
                    [ <b> Date : </b>
                    {new Date(item.created).toLocaleDateString()} {"   "}
                    <b>Time : </b>:{" "}
                    {new Date(item.created).toLocaleTimeString()} ] {"  "}
                    <b>
                      {" "}
                      {item.comment_by.username} : {item.content}
                    </b>
                  </li>
                ))
              : "No Comments"}
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

// {
//   "id": "fff0466d-8149-4acb-b6c2-c75ff6ada27a",
//   "created": "2023-01-22T10:59:42.079Z",
//   "resolve_at": "2023-01-22T10:59:39Z",
//   "resolve_by": "asd",
//   "created_by": "asd",
//   "assign_to": "mohammadk",
//   "status": "Resolve",
//   "issue_type": null,
//   "vendor": "asd",
//   "order_id": 2,
//   "description": "adas",
//   "priority": "Urgent",
//   "comment_ticket": [
//     {
//       "content": "test",
//       "created": "2023-01-22T11:24:38.938Z",
//       "comment_by": {
//         "id": "47a2631d-6d01-4680-b4d4-738b70200b23",
//         "username": "mohammadk",
//         "first_name": "",
//         "last_name": "",
//         "email": "mohammad.kareem@baly.iq",
//         "phone_number": "123",
//         "user_permissions": []
//       }
//     },
//     {
//       "content": "test",
//       "created": "2023-01-22T11:24:48.475Z",
//       "comment_by": {
//         "id": "47a2631d-6d01-4680-b4d4-738b70200b23",
//         "username": "mohammadk",
//         "first_name": "",
//         "last_name": "",
//         "email": "mohammad.kareem@baly.iq",
//         "phone_number": "123",
//         "user_permissions": []
//       }
//     }
//   ]
// },

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
