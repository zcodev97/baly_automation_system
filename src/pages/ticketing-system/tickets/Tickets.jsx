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
  const [loading, setLoading] = useState(false);

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
          resolve_at: row.resolve_at,
          resolve_by: row.resolve_by,
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

  async function GetAllTickets() {
    setLoading(true);
    var token = localStorage.getItem("token");

    let res = await fetch(BACKEND_URL + "ticket_system/get_all_ticket", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    let ticketJsonData = await res.json();
    setTickets(ticketJsonData);
    setLoading(false);
  }

  const dateFormatter = (cell) => {
    return cell != null ? moment(cell).format("MM/DD/YYYY") : "";
  };

  function addTicket() {
    navigate("/newticket");
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

  return (
    <>
      <NavBar />
      {loading ? (
        <Loading />
      ) : (
        <>
          <div className="container p-2 mt-2   border-2 border-bottom border-primary text-dark rounded">
            <h3 className="text-center">
              <b> All Tickets</b>
            </h3>
          </div>
          <div className="container-fluid">
            <div className="table-responsive text-center">
              <BootstrapTable
                bordered={true}
                hover={true}
                keyField="id"
                columns={fields}
                data={tickets}
                pagination={pagination}
                filter={filterFactory()}
                responsive={true}
                rowEvents={rowEvents}
              />
            </div>
          </div>
          <div className="container-fluid  text-start ">
            <b
              className="btn btn-success border w-10 text-center border-3 mt-2 mb-2"
              onClick={addTicket}
            >
              Add Ticket ➕
            </b>
          </div>{" "}
        </>
      )}
    </>
  );
}

export default Tickets;
