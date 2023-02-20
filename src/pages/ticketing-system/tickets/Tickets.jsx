import BootstrapTable from "react-bootstrap-table-next";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.css";
import paginationFactory from "react-bootstrap-table2-paginator";
import filterFactory, { textFilter } from "react-bootstrap-table2-filter";
import "react-bootstrap-table2-filter/dist/react-bootstrap-table2-filter.min.css";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";
import "react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Loading from "../../../components/loading";
import NavBar from "../../../components/navBar";
import moment from "moment";
import BACKEND_URL from "../../../global";

// Data for the table to display; can be anything

function Tickets() {
  const navigate = useNavigate();

  const [tickets, setTickets] = useState([]);
  const [notFilteredTickets, setNotFilteredTickets] = useState([]);
  const [loading, setLoading] = useState(false);

  const [lowPendingPriorityTickets, setLowPendingPriorityTickets] = useState(0);
  const [midPendingPriorityTickets, setMidPendingPriorityTickets] = useState(0);
  const [highPendingPriorityTickets, setHighPendingPriorityTickets] =
    useState(0);
  const [urgentPendingPriorityTickets, setUrgenPendingtPriorityTickets] =
    useState(0);

  const [lowResolvedPriorityTickets, setLowResolvedPriorityTickets] =
    useState(0);
  const [midResolvedPriorityTickets, setMidResolvedPriorityTickets] =
    useState(0);
  const [highResolvedPriorityTickets, setHighResolvedPriorityTickets] =
    useState(0);
  const [urgentResolvedPriorityTickets, setUrgenResolvedtPriorityTickets] =
    useState(0);

  const rowEvents = {
    onClick: (e, row, rowIndex) => {},
  };

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

  const pagination = paginationFactory({
    page: 1,
    sizePerPage: 10,
    lastPageText: ">>",
    firstPageText: "<<",
    nextPageText: ">",
    prePageText: "<",
    showTotal: true,
    alwaysShowAllBtns: false,
  });

  async function GetAllTickets() {
    setLoading(true);
    var token = localStorage.getItem("token");

    fetch(BACKEND_URL + `ticket_system/get_all_ticket`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setTickets(data);
        setNotFilteredTickets(data);
        console.log(tickets);
        setLoading(false);
      })
      .catch((error) => {
        alert("Error In getting Comments 😕");
      });
  }

  const dateFormatter = (cell) => {
    return cell != null ? moment(cell).format("MM/DD/YYYY") : "";
  };

  function addTicket() {
    navigate("/newticket");
  }

  useEffect(() => {
    GetAllTickets();
    // getAllTickets();
  }, []);

  // Fields to show in the table, and what object properties in the data they bind to
  const fields = [
    {
      dataField: "vendor",
      text: "Vendor",
      sort: true,
      filter: textFilter(),
      showTitle: false,
      fixed: true,
    },
    {
      dataField: "issue_type",
      text: "Issue Type",
      sort: true,
      filter: textFilter(),
    },
    {
      dataField: "order_id",
      text: "Order ID",
      sort: true,
      filter: textFilter(),
    },
    {
      dataField: "description",
      text: "Description",
      sort: true,
      filter: textFilter(),
      showTitle: false,
    },
    {
      dataField: "assign_to",
      text: "Assign To",
      sort: true,
      filter: textFilter(),
      showTitle: false,
    },
    {
      dataField: "priority",
      text: "Priority",
      sort: true,
      filter: textFilter(),
    },

    {
      dataField: "status",
      text: "Status",
      sort: true,
      filter: textFilter(),
    },
    {
      dataField: "created",
      text: "Created At",
      sort: true,
      filter: textFilter(),
      formatter: dateFormatter,
    },
    {
      dataField: "created_by",
      text: "Created By",

      sort: true,
      filter: textFilter(),
    },
    {
      dataField: "resolve_at",
      text: "Resolved At",
      sort: true,
      filter: textFilter(),
      formatter: dateFormatter,
    },
    {
      dataField: "resolve_by",
      text: "Resolved By",
      sort: true,
      filter: textFilter(),
    },
  ];

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

  // if (tickets.length === 0) {
  //   return <NoDataView />;
  // }

  return (
    <>
      <NavBar />

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
              <b> Tickets : {tickets.length} </b>
            </div>
          </div>
        </div>
      </div>

      <div className="table-responsive">
        <table className="table   table-dark  table-striped  table-bordered table-hover">
          <thead>
            <tr className="text-center">
              {/* view all of the selected days from the returned object by iterating throw it  */}
              {tickets?.length === 0
                ? ""
                : Object.keys(tickets[0])
                    .splice(1, 10)
                    .map((header, index) => (
                      <th
                        key={index}
                        style={{
                          minWidth: 100,
                          width: 100,
                          textAlign: "center",
                        }}
                        className={"bg-light text-dark"}
                      >
                        <b> {header.toLocaleUpperCase()}</b>
                      </th>
                    ))}
            </tr>
          </thead>
          <tbody className="text-center">
            {tickets?.length === 0 ? (
              <p className="text-dark">
                Please Select Start and End Date and Press Get Report 😁
              </p>
            ) : (
              Object.values(tickets)?.map((ticket) => (
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
              ))
            )}
          </tbody>
        </table>
      </div>
    </>
  );

  function formatDate(cell) {
    const date = new Date(cell);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    const formattedDate = `${year}-${month}-${day}`;
    return formattedDate + " " + date.toLocaleTimeString();
  }
}

export default Tickets;

// export const data = data;

//set progressbar for all tickets priority low mid high urgent
// set the auto sign for the vendor when the cc click on resturant
// format the date in the column
//
