import "react-bootstrap-table-next/dist/react-bootstrap-table2.css";
import "react-bootstrap-table2-filter/dist/react-bootstrap-table2-filter.min.css";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";
import "react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Loading from "../../../components/loading";
import NavBar from "../../../components/navBar";
import BACKEND_URL from "../../../global";

function Tickets() {
  const navigate = useNavigate();

  const [tickets, setTickets] = useState([]);
  const [tableData, setTableData] = useState([]);
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
        setTableData(data);
        setTableData(data.slice(0, 5));
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
        <div className="container-fluid">
          <div className="row   d-flex justify-content-center align-items-center">
            <div className="col-md-2">
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
            <div className="col-md-6">
              {/* pagination */}
              <div className="container-fluid">
                {/* navigate to Initial table page */}
                <div className="btn btn-light border border-2 border-dark m-1">
                  {"<<"}
                </div>
                {/*   navigate to previous slide  */}
                <div className="btn btn-light border border-2 border-dark m-1">
                  {"<"}
                </div>
                {/* show only five buttons if the data more than 25 rows else show only buttons divided by the number of rows so for example is the data is 16 
                16 / 5 = 3.2 
                so we need to ceil it to 4, by calling Math.ceil(3.2)
                now the nums of buttons is 4 
                button 1 shows 5 rows 
                button 2 shows 5 rows
                button 3 shows 5 rows
                button 4 shows only 1 row for coz 16 - ( 5 * 3 = 15 ) = 1 
                */}

                {tickets.length === 0
                  ? "no data"
                  : tickets.length < 5
                  ? "."
                  : tickets.length > 5
                  ? showPaginationTable()
                  : null}

                {/*   navigate to next slide  */}
                <div className="btn btn-light border border-2 border-dark m-1">
                  {">"}
                </div>
                {/* navigate to end table page */}
                <div className="btn btn-light border border-2 border-dark m-1">
                  {">>"}
                </div>
              </div>
            </div>
            <div className="col-md-2">
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

        <div className="table-responsive">
          <table className="table   table-dark  table-striped  table-bordered table-hover">
            <thead>
              <tr className="text-center">
                {Object.values(tableData)
                  .slice(1, 2)
                  .map((header, index) =>
                    Object.keys(header)
                      .splice(1, 10)
                      .map((sh, si) => (
                        <th key={si} className={"bg-light text-dark"}>
                          <b> {sh.toLocaleUpperCase()}</b>
                        </th>
                      ))
                  )}
              </tr>
            </thead>
            <tbody className="text-center ">
              {Object.values(tableData).map((ticket) => (
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
      </>
    );
  }

  function showPaginationTable(number) {
    let rowsPerPage = 5;
    let numberOfButtons = Math.ceil(tickets.length / rowsPerPage);

    let buttonsElement = [];

    for (let index = 0; index < numberOfButtons; index++) {
      let button = (
        <div
          className="btn btn-light border border-dark border-1 m-1"
          onClick={() => {
            setTableData(
              index === 0
                ? tickets.slice(index, 5)
                : tickets.slice(index + 5, (index + 5) * 2)
            );
            // setTableData(tickets);
          }}
        >
          {index + 1}
        </div>
      );
      buttonsElement.push(button);
    }

    return buttonsElement;
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

export default Tickets;

// export const data = data;

//set progressbar for all tickets priority low mid high urgent
// set the auto sign for the vendor when the cc click on resturant
// format the date in the column
//
