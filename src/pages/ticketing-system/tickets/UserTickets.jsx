import "react-bootstrap-table-next/dist/react-bootstrap-table2.css";
import "react-bootstrap-table2-filter/dist/react-bootstrap-table2-filter.min.css";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";
import "react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Loading from "../../../components/loading";
import NavBar from "../../../components/navBar";
import BACKEND_URL from "../../../global";

function UserTicketsPage() {
  const navigate = useNavigate();

  const [tickets, setTickets] = useState([]);
  const [notFilteredTickets, setNotFilteredTickets] = useState([]);
  const [loading, setLoading] = useState(false);

  const [detail, setDetail] = useState("");

  function GoToTicketDetails(row) {
    navigate("/ticket_details", {
      state: {
        id: row.id,
        created_by: row.created_by,
        vendor: row.vendor,
        issue_type: row.issue_type,
        order_id: row.order_id,
        description: row.description,
        assign_to: row.assign_to,
        priority: row.priority,
        status: row.status,
        created_at: row.created,
        resolved_at: row.resolve_at,
        resolved_by: row.resolve_by,
        comments: row.comment_ticket,
      },
    });
  }

  async function GetAllTickets() {
    setLoading(true);
    var token = localStorage.getItem("token");

    await fetch(BACKEND_URL + "ticket_system/get_all_ticket", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        if (data.detail) {
          setDetail(data.detail);
          setTickets([]);
          setNotFilteredTickets([]);
          setLoading(false);
          return;
        }

        setTickets(data);
        setNotFilteredTickets(data);
        setLoading(false);
      })
      .catch((error) => {
        alert(error);
      });
  }

  async function GetAllTickets() {
    setLoading(true);
    var token = localStorage.getItem("token");

    await fetch(BACKEND_URL + "ticket_system/get_all_your_ticket", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        if (data.detail) {
          setDetail(data.detail);
          setTickets([]);
          setNotFilteredTickets([]);
          setLoading(false);
          return;
        }
        setTickets(data);
        setNotFilteredTickets(data);
        setLoading(false);
      })
      .catch((error) => {
        alert(error);
      });
  }

  function addTicket() {
    navigate("/newticket");
  }

  useEffect(() => {
    GetAllTickets();
  }, []);

  function handleOrderIdInput(e) {
    let filteredTickets = tickets.filter((ticket) =>
      ticket.order_id.toString().includes(e.target.value.toString())
    );
    // setTimeout(() => {}, 1000);

    setTickets(filteredTickets);
    if (e.target.value.length === 0) {
      setTickets(notFilteredTickets);
    }
  }

  if (loading) {
    return <Loading />;
  }

  return (
    <>
      <NavBar />
      {detail.length > 0 ? detail : TicketsView()}
    </>
  );

  function TicketsView() {
    return (
      <>
        <div className="container">
          <div className="row   d-flex justify-content-center align-items-center">
            <div className="col-md-6">
              {/* order ID */}
              <input
                className="form-control"
                id="uname"
                placeholder="Search Here By Order ID"
                name="uname"
                required=""
                onChange={handleOrderIdInput}
              />
            </div>
            <div className="col-md-4">
              <div
                className="btn btn-light border  border-3 border-success text-center"
                onClick={addTicket}
              >
                <b> Add Ticket ➕ </b>
              </div>
            </div>

            <div className="col-md-2">
              {/* order ID */}
              <div className="container border-bottom   border-3   m-2 p-2">
                <b> Tickets : {detail ? 0 : tickets.length} </b>
              </div>
            </div>
          </div>
        </div>

        {tickets.length === 0 ? (
          "No Tickets"
        ) : (
          <div className="table-responsive">
            <table className="table   table-dark  table-striped  table-bordered table-hover">
              <thead>
                <tr className="text-center">
                  {Object.keys(tickets[0])
                    .splice(1, 10)
                    .map((header, index) => (
                      <th key={index} className={"bg-light text-dark"}>
                        <b> {header.toLocaleUpperCase()}</b>
                      </th>
                    ))}
                </tr>
              </thead>
              <tbody className="text-center ">
                {Object.values(tickets).map((ticket) => (
                  <tr key={ticket.id} onClick={() => GoToTicketDetails(ticket)}>
                    {Object.values(ticket)
                      .splice(1, 10)
                      .map((cell, index) => (
                        <td key={index}>
                          {" "}
                          {index === 0
                            ? formatDate(cell)
                            : index === 1
                            ? new Date(cell).toLocaleDateString() ===
                              new Date("1970-01-01").toLocaleDateString()
                              ? ""
                              : formatDate(cell)
                            : cell}
                        </td>
                      ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </>
    );
  }

  function formatDate(cell) {
    const date = new Date(cell);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    const formattedDate = `${year}-${month}-${day}`;
    return formattedDate + " " + date.toLocaleTimeString();
  }
}

export default UserTicketsPage;
