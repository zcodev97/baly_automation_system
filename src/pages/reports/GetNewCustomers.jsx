import { useNavigate } from "react-router-dom";
import axios from "axios";
import BootstrapTable from "react-bootstrap-table-next";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.css";
import paginationFactory from "react-bootstrap-table2-paginator";
import filterFactory, { textFilter } from "react-bootstrap-table2-filter";
import "react-bootstrap-table2-filter/dist/react-bootstrap-table2-filter.min.css";
import React, { useEffect, useState } from "react";
import NoDataView from "../../components/noData";
import Loading from "../../components/loading";
import { Navbar } from "react-bootstrap";
import NavBar from "../../components/navBar";
import * as Icon from "react-bootstrap-icons";
import moment from "moment";
import DateTimePicker from "react-datetime-picker";

function GetNewCustomersReportPage() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [startFirstDate, setStartFirstDate] = useState(new Date());
  const [endFirstDate, setEndFirstDate] = useState(new Date());
  const [startSecondDate, setStartSecondDate] = useState(new Date());
  const [endSecondDate, setEndSecondDate] = useState(new Date());
  const [data, setData] = useState([]);

  const pagination = paginationFactory({
    page: 1,
    sizePerPage: 5,
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

  // Fields to show in the table, and what object properties in the data they bind to
  const fields = [
    {
      dataField: "week",
      text: "Week",
      showTitle: false,
    },
    {
      dataField: "total_new",
      text: "Total New",
    },
    {
      dataField: "new_net",
      text: "New Net",
    },
    {
      dataField: "order_1",
      text: "Order 1",
    },
    {
      dataField: "order_2",
      text: "Order 2",
    },
    {
      dataField: "order_3",
      text: "Order 3",
    },
    {
      dataField: "order_4",
      text: "Order 4+",
    },
  ];

  async function getReport() {
    setLoading(true);
    let token = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwayI6IjhmNWZlZjVjLTM4ZGUtNGI2YS1hNTE4LTNkZWY0YWE5MGM0MyJ9.DIuzjjlcRf7Jr-pUPHJl08OJnxzr4UE-zi6C_GbzbNg`;

    let formattedFirstDateStart = new Date(startFirstDate)
      .toISOString()
      .slice(0, 10);
    let formattedFirstDateEnd = new Date(endFirstDate)
      .toISOString()
      .slice(0, 10);
    let formattedSecondDateStart = new Date(startSecondDate)
      .toISOString()
      .slice(0, 10);
    let formattedSecondDateEnd = new Date(endSecondDate)
      .toISOString()
      .slice(0, 10);

    fetch(
      `http://django-env-v1.eba-cveq8rvb.us-west-2.elasticbeanstalk.com/api/reports/get_new_customers?start_date_week1=${formattedFirstDateStart}&end_date_week1=${formattedFirstDateEnd}&start_date_week2=${formattedSecondDateStart}&end_date_week2=${formattedSecondDateEnd}`,
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
        console.log(data);
        setData(data);
        setLoading(false);
      })
      .catch((error) => {
        alert("Error In Adding new Comment 😕");
        setLoading(false);
      });
  }

  useEffect(() => {
    //
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <>
      <NavBar />
      {/* first date */}
      <div className="container border border-2    mt-2 mb-2 w-50 rounded">
        <div className="row text-center bg-light ">
          <div className="col-md-6">
            <div className="container p-2  m-1">
              <b> First Week : </b> Start Date{"  "}
              <DateTimePicker
                key={1}
                clearIcon={null}
                format={"y-MM-dd"}
                onChange={setStartFirstDate}
                value={startFirstDate}
              />
            </div>
          </div>
          <div className="col-md-6">
            <div className="container p-2  m-1">
              End Date{"  "}
              <DateTimePicker
                key={2}
                clearIcon={null}
                format={"y-MM-dd"}
                onChange={setEndFirstDate}
                value={endFirstDate}
              />
            </div>
          </div>
        </div>
      </div>
      {/* second date */}
      <div className="container border border-2    mt-2 mb-2 w-50 rounded">
        <div className="row text-center bg-light ">
          <div className="col-md-6">
            <div className="container p-2  m-1">
              <b>Second Week : </b>Start Date {"  "}
              <DateTimePicker
                key={3}
                clearIcon={null}
                format={"y-MM-dd"}
                onChange={setStartSecondDate}
                value={startSecondDate}
              />
            </div>
          </div>
          <div className="col-md-6">
            <div className="container p-2  m-1">
              End Date {"  "}
              <DateTimePicker
                key={4}
                clearIcon={null}
                format={"y-MM-dd"}
                onChange={setEndSecondDate}
                value={endSecondDate}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="container text-center ">
        <button
          className="btn btn-primary border border-2 p-2"
          onClick={getReport}
        >
          Get Report
        </button>
      </div>

      <div className="container w-50 mt-4 ">
        <BootstrapTable
          // className="table-responsive"
          bordered={true}
          bootstrap4
          hover={true}
          keyField="id"
          columns={fields}
          data={data}
          //   pagination={pagination}
          filter={filterFactory()}
          rowStyle={rowStyle}
        />
      </div>
    </>
  );
}

export default GetNewCustomersReportPage;
