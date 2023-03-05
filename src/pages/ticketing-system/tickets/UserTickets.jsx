import axios from "axios";
import BootstrapTable from "react-bootstrap-table-next";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.css";
import paginationFactory from "react-bootstrap-table2-paginator";
import filterFactory, { textFilter } from "react-bootstrap-table2-filter";
import "react-bootstrap-table2-filter/dist/react-bootstrap-table2-filter.min.css";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";
import "react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import NoDataView from "../../../components/noData";
import supabase from "../../../supabase";
import Loading from "../../../components/loading";
import { Navbar } from "react-bootstrap";
import NavBar from "../../../components/navBar";
import * as Icon from "react-bootstrap-icons";
import moment from "moment";
import { BACKEND_URL } from "../../../global";

// Data for the table to display; can be anything

function Tickets() {
  const navigate = useNavigate();

  const [tickets, setTickets] = useState([]);
  const [ticketsFilterType, setFilterTicketsType] = useState(0);
  const [filteredTickets, setFilteredtickets] = useState([]);
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
    onClick: (e, row, rowIndex) => {
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
    },
  };

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

  async function GetMyTickets() {
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
          setTickets([]);

          setLoading(false);
          return;
        }
        setTickets(data);
        setFilteredtickets(data);

        setLoading(false);
      })
      .catch((error) => {
        alert(error);
      });
  }

  const dateFormatter = (cell) => {
    return cell != null ? moment(cell).format("MM/DD/YYYY") : "";
  };

  function addTicket() {
    navigate("/newticket");
  }

  function filterTickets(filter) {
    let currentUser = localStorage.getItem("username");

    currentUser = currentUser.replace(/['"]/g, "");

    setFilteredtickets(tickets);

    setTimeout(() => {}, 1000);

    console.log(filteredTickets);

    if (filter === 0) {
      setFilterTicketsType(0);
      return;
    }

    if (filter === 1) {
      setFilterTicketsType(1);

      let createdByCurrentUser = tickets.filter(
        (v) => v.created_by === currentUser
      );
      setFilteredtickets(createdByCurrentUser);
    }

    if (filter === 2) {
      setFilterTicketsType(2);

      let assignToCurrentUser = tickets.filter(
        (v) => v.assign_to === currentUser
      );
      setFilteredtickets(assignToCurrentUser);
    }
  }

  useEffect(() => {
    setLoading(true);

    var token = localStorage.getItem("token");

    console.log(token);

    if (token === "" || token === null || token === undefined) {
      navigate("/login", { replace: true });
      setLoading(false);

      return;
    }

    GetMyTickets();
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
    },
    {
      dataField: "assign_to",
      text: "Assign To",
      sort: true,
      filter: textFilter(),
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

  if (loading) {
    return <Loading />;
  }

  return (
    <>
      <NavBar />
      <div className="container p-2 mt-2   border-2 border-bottom border-primary text-dark rounded">
        <h3 className="text-center">
          <b> My Tickets</b>
        </h3>
      </div>
      <div className="container bg-warning rounded mt-1 mb-1 text-center">
        <div className="row d-flex justify-content-center align-items-center">
          <div className="col-xl-3">
            <div
              className="btn btn-light border w-10 text-center border-3 mt-2 mb-2"
              onClick={addTicket}
            >
              <b> Add Ticket </b> ➕
            </div>
          </div>
          <div className="col-xl-3">
            <b
              className="btn btn-secondary border w-10 text-center border-3 mt-2 mb-2"
              onClick={() => filterTickets(0)}
            >
              My Tickets {ticketsFilterType === 0 ? " 🤚" : ""}
            </b>
          </div>
          <div className="col-xl-3">
            <b
              className="btn btn-primary border w-10 text-center border-3 mt-2 mb-2"
              onClick={() => filterTickets(1)}
            >
              Submitted Tickets {ticketsFilterType === 1 ? " 🤚" : ""}
            </b>
          </div>
          <div className="col-xl-3">
            <b
              className="btn btn-danger border w-10 text-center border-3 mt-2 mb-2"
              onClick={() => filterTickets(2)}
            >
              Assigned To me {ticketsFilterType === 2 ? " 🤚" : ""}
            </b>
          </div>
        </div>
      </div>
      <div className="container-fluid">
        <BootstrapTable
          bordered={true}
          hover={true}
          keyField="id"
          columns={fields}
          striped
          data={filteredTickets}
          pagination={pagination}
          filter={filterFactory()}
          responsive={true}
          rowEvents={rowEvents}
          wrapperClasses="table-responsive"
        />
      </div>
    </>
  );
}

export default Tickets;
