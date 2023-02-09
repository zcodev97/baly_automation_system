// for excel and pdf
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";
//

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

// var json2xls = require("json2xls");

function GetNewCustomersReportPage() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [startFirstDate, setStartFirstDate] = useState(new Date());
  const [endFirstDate, setEndFirstDate] = useState(new Date());
  const [startSecondDate, setStartSecondDate] = useState(new Date());
  const [endSecondDate, setEndSecondDate] = useState(new Date());
  const [data, setData] = useState([]);

  //convert json to excel
  const JSONToExcel = (jsonData, fileName) => {
    const worksheet = XLSX.utils.json_to_sheet(jsonData);
    const workbook = { Sheets: { data: worksheet }, SheetNames: ["data"] };
    XLSX.writeFile(workbook, `${fileName}.xlsx`);
  };

  function exportToPDF() {
    const pdf = new jsPDF();

    const head = fields.map(function (json) {
      return [json.text];
    });

    const body = data.map(function (json) {
      return [
        json.week,
        json.total_new,
        json.new_net,
        json.order_1,
        json.order_2,
        json.order_3,
        json.order_4,
      ];
    });

    console.log(body);

    // Add header text
    pdf.setFont("helvetica");
    pdf.setFontSize(20);
    pdf.text("New Customers", pdf.internal.pageSize.width / 2, 20, {
      align: "center",
    });

    pdf.autoTable({
      head: [head],
      body: [...body],
    });

    pdf.save("table.pdf");
  }

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
    var token = localStorage.getItem("token");

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

      <div className="container w-50 mt-4 " id="get_new_customers_table">
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
        <div className="row">
          <div className="col-md-6">
            <div
              className="container btn btn-success"
              onClick={() => {
                JSONToExcel(data, "ExampleFile");
              }}
            >
              <b> Export Excel</b>
            </div>
          </div>
          <div className="col-md-6">
            <div className="container btn btn-danger" onClick={exportToPDF}>
              <b> Export PDF</b>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default GetNewCustomersReportPage;
