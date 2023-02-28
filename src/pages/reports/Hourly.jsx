// for excel and pdf
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";

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
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import DateTimePicker from "react-datetime-picker";

function HourlyReportPage() {
  const [loading, setLoading] = useState(false);

  const [startFirstDate, setStartFirstDate] = useState(new Date());
  const [endFirstDate, setEndFirstDate] = useState(new Date());
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
        json.hour,
        json.gross_orders,
        json.net_orders,
        json.cancelled_orders,
      ];
    });

    pdf.autoTable({
      head: [head],
      body: [...body],
    });

    pdf.save("table.pdf");
  }

  async function getReport() {
    setLoading(true);
    var token = localStorage.getItem("token");

    let formattedFirstDateStart = new Date(startFirstDate)
      .toISOString()
      .slice(0, 10);
    let formattedFirstDateEnd = new Date(endFirstDate)
      .toISOString()
      .slice(0, 10);

    fetch(
      `http://django-env-v1.eba-cveq8rvb.us-west-2.elasticbeanstalk.com/api/reports/get_hourly_report?start_date=${formattedFirstDateStart}&end_date=${formattedFirstDateEnd}`,
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

  const fields = [
    {
      dataField: "hour",
      text: "Hour",
      showTitle: false,
    },
    {
      dataField: "gross_orders",
      text: "Gross Orders",
    },
    {
      dataField: "net_orders",
      text: "Net Orders",
    },
    {
      dataField: "cancelled_orders",
      text: "Cancelled Orders",
    },
  ];

  if (loading) {
    return <Loading />;
  }

  return (
    <>
      <NavBar />
      <div className="container p-2 mt-1   border-2 border-bottom border-primary text-dark rounded">
        <h3 className="text-center">
          <b>Hourly Report </b>
        </h3>
      </div>
      <div className="container border border-2 border-dark  rounded p-2 mt-1 mb-1 ">
        <div className="row">
          <div className="col-md-3">
            <div className="container p-2 ">
              Start Date{"  "}
              <DateTimePicker
                key={1}
                clearIcon={null}
                format={"y-MM-dd"}
                onChange={setStartFirstDate}
                value={startFirstDate}
              />
            </div>
          </div>
          <div className="col-md-3">
            <div className="container p-2 ">
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
          <div className="col-md-2">
            <div
              className="container btn btn-light border border-2 border-primary text-primary"
              onClick={getReport}
            >
              <b> Get Report</b>
            </div>
          </div>
          <div className="col-md-2">
            <div
              className="container btn btn-success"
              onClick={() => {
                JSONToExcel(data, "ExampleFile");
              }}
            >
              <b> Export Excel</b>
            </div>
          </div>
          <div className="col-md-2">
            <div className="container btn btn-danger" onClick={exportToPDF}>
              <b> Export PDF</b>
            </div>
          </div>
        </div>
      </div>
      <div className="container-fluid mt-2">
        <div className="row p-0 m-0 d-flex justify-content-center align-items-center">
          <div className="col-xl-4 m-0 p-0">
            <div className="table-responsive p-0 m-0">
              <table className="table table-sm   table-bordered table-hover">
                <thead className="bg-dark text-light">
                  <tr className="text-center">
                    {/* view all of the selected days from the returned object by iterating throw it  */}
                    {data.length === 0
                      ? ""
                      : Object.keys(Object.values(data)[0]).map(
                          (header, index) => (
                            <th
                              key={index}
                              style={{
                                minWidth: 100,
                                width: 100,
                                textAlign: "center",
                              }}
                            >
                              {header}
                            </th>
                          )
                        )}
                  </tr>
                </thead>
                <tbody className="text-center m-0 bg-secondary text-light">
                  {data.length === 0 ? (
                    <p className="text-dark">
                      Please Select Start and End Date and Press Get Report 😁
                    </p>
                  ) : (
                    Object.values(data).map((header, index) => (
                      <tr>
                        {Object.values(header).map((sh, si) => (
                          <td key={si}>{sh}</td>
                        ))}{" "}
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="col-xl-8 m-0 p-0">
            <LineChart
              width={1000}
              height={300}
              data={Object.values(data)
                .slice(0, -1)
                .map((record) => {
                  return {
                    name: record.hour,
                    gross_orders: record.gross_orders,
                    net_orders: record.net_orders,
                    cancelled_orders: record.cancelled_orders,
                    pv: 2400,
                    amt: 2400,
                  };
                })}
              margin={{ top: 5, right: 5, bottom: 5, left: 5 }}
            >
              <Line type="monotone" dataKey="gross_orders" stroke="#8884d8" />
              <Line type="monotone" dataKey="net_orders" stroke="green" />
              <Line type="monotone" dataKey="cancelled_orders" stroke="red" />
              <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
            </LineChart>
          </div>
        </div>
      </div>
    </>
  );
}

export default HourlyReportPage;
