import axios from "axios";
import BootstrapTable from "react-bootstrap-table-next";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.css";
import paginationFactory from "react-bootstrap-table2-paginator";
import filterFactory, { textFilter } from "react-bootstrap-table2-filter";
import "react-bootstrap-table2-filter/dist/react-bootstrap-table2-filter.min.css";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import NoDataView from "../../../components/noData";
import supabase from "../../../supabase";
import Loading from "../../../components/loading";
import { Navbar } from "react-bootstrap";
import NavBar from "../../../components/navBar";
import * as Icon from "react-bootstrap-icons";
import moment from "moment";

// Data for the table to display; can be anything

function Tickets() {
  const navigate = useNavigate();

  const [tickets, setTickets] = useState([]);
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

  const rowStyle = (row, rowIndex) => {
    // if(row.created_at){
    //     return row.created_at.toLocaleDateString()
    // }
    if (row.status === "resolved") {
      return { color: "white", background: "#40916c", fontWeight: "bold" };
    } else if (row.priority === 1) {
      // #0d6efd
      return { color: "white", background: "#0d6efd", fontWeight: "bold" };
    } else if (row.priority === 2) {
      return { color: "white", background: "#B22222", fontWeight: "bold" };
    } else if (row.priority === 3) {
      return { color: "white", background: "#CD5C5C", fontWeight: "bold" };
    } else if (row.priority === 4) {
      return { color: "black", background: "#FF8C00", fontWeight: "bold" };
    }
  };

  async function GetAllTickets() {
    setLoading(true);
    var token = localStorage.getItem("token");

    let res = await fetch(
      "http://django-env-v1.eba-cveq8rvb.us-west-2.elasticbeanstalk.com/api/ticket_system/get_all_ticket",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    let ticketJsonData = await res.json();
    setTickets(ticketJsonData);
    setLoading(false);

    console.log(ticketJsonData);
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

  if (tickets.length === 0) {
    return <NoDataView />;
  }

  return (
    <>
      <NavBar />
      {/* 
      <div className="d-flex justify-content-center  p-1 bg-dark rounded-bottom ">
        <div className="col-md-6 center-block ">
          <div className="container text-center  w-50 bg-dark text-light rounded p-2 ">
            Total Pending Tickets{" "}
            <b>
              {lowPendingPriorityTickets +
                midPendingPriorityTickets +
                highPendingPriorityTickets +
                urgentPendingPriorityTickets}{" "}
            </b>
            <div
              className="progress-bar bg-info rounded text-dark m-1"
              style={{
                width: { lowPriorityTickets: lowPendingPriorityTickets } + "%",
                fontWeight: "bold",
              }}
            >
              Low Priority Pending Tickets {lowPendingPriorityTickets}
            </div>
            <div
              className="progress-bar bg-warning rounded text-dark m-1"
              style={{
                width: { midPriorityTickets: midPendingPriorityTickets } + "%",
              }}
            >
              Mid Priority Pending Tickets {midPendingPriorityTickets}
            </div>
            <div
              className="progress-bar bg-danger rounded text-light m-1"
              style={{
                width:
                  { highPriorityTickets: highPendingPriorityTickets } + "%",
              }}
            >
              High Priority Pending Tickets {highPendingPriorityTickets}
            </div>
            <div
              className="progress-bar bg-primary rounded text-light m-1"
              style={{
                width:
                  { urgentPriorityTickets: urgentPendingPriorityTickets } + "%",
              }}
            >
              Urgent Priority Pending Tickets {urgentPendingPriorityTickets}
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="container text-center w-50 bg-dark text-light rounded p-2 ">
            Total Resolved Tickets{" "}
            <b>
              {lowResolvedPriorityTickets +
                midResolvedPriorityTickets +
                highResolvedPriorityTickets +
                urgentResolvedPriorityTickets}{" "}
            </b>
            <div
              className="progress-bar bg-info rounded text-dark m-1"
              style={{
                width: { lowPriorityTickets: lowResolvedPriorityTickets } + "%",
                fontWeight: "bold",
              }}
            >
              Low Resolved Priority Tickets {lowResolvedPriorityTickets}
            </div>
            <div
              className="progress-bar bg-warning rounded text-dark m-1"
              style={{
                width: { midPriorityTickets: midResolvedPriorityTickets } + "%",
              }}
            >
              Mid Resolved Priority Tickets {midResolvedPriorityTickets}
            </div>
            <div
              className="progress-bar bg-danger rounded text-light m-1"
              style={{
                width:
                  { highPriorityTickets: highResolvedPriorityTickets } + "%",
              }}
            >
              High Resolved Priority Tickets {highResolvedPriorityTickets}
            </div>
            <div
              className="progress-bar bg-primary rounded text-light m-1"
              style={{
                width: { urgentResolvedPriorityTickets } + "%",
              }}
            >
              Urgent Resolved Priority Tickets {urgentResolvedPriorityTickets}
            </div>
          </div>
        </div>
      </div> */}

      <BootstrapTable
        // className="table-responsive"
        bordered={false}
        bootstrap4
        hover={true}
        keyField="id"
        columns={fields}
        data={tickets}
        pagination={pagination}
        filter={filterFactory()}
        rowStyle={rowStyle}
        rowEvents={rowEvents}
      />
      <div className="container-fluid  text-start ">
        <b
          className="btn btn-success border w-10 text-center border-3 mt-2 mb-2"
          onClick={addTicket}
        >
          Add Ticket ➕
        </b>
      </div>
    </>
  );
}

export default Tickets;

// export const data = data;

//set progressbar for all tickets priority low mid high urgent
// set the auto sign for the vendor when the cc click on resturant
// format the date in the column
//
