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
import DateTimePicker from "react-datetime-picker";
import { Table, Container } from "react-bootstrap";
import { position } from "@chakra-ui/react";

function VendorKPIReport() {
  const [startFirstDate, setStartFirstDate] = useState(new Date());
  const [endFirstDate, setEndFirstDate] = useState(new Date());
  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(false);

  const [minValues, setMinValues] = useState([]);
  const [maxValues, setMaxValues] = useState([]);

  const colorScale = (sh, si, header, index) => {
    console.log("index");
    console.log(index);
    let returnedValue = Object.values(header);

    returnedValue.pop();

    let sortedValues = returnedValue.sort((a, b) => a - b);

    var minValue = Math.min(...sortedValues);
    var maxValue = Math.max(...sortedValues);

    const percentage = (sh - maxValue) / (minValue - maxValue);
    const cappedPercentage = Math.min(1, Math.max(0, percentage));
    const red = Math.round(255 * cappedPercentage);
    const green = Math.round(255 * (1 - cappedPercentage));

    if (si === 4) {
      sh.toLocaleString("en-US", { style: "currency", currency: "USD" });
    }

    return {
      backgroundColor: `rgb(${red}, ${green}, 0)`,
    };
  };

  //convert json to excel
  const JSONToExcel = (jsonData, fileName) => {
    // const worksheet = XLSX.utils.json_to_sheet(jsonData);
    // const workbook = { Sheets: { data: worksheet }, SheetNames: ["data"] };
    // XLSX.writeFile(workbook, `${fileName}.xlsx`);

    alert("coming...");
  };

  function exportToPDF() {
    // const pdf = new jsPDF();

    // const body = reportData.map(function (json) {
    //   return [
    //     json.hour,
    //     json.gross_orders,
    //     json.net_orders,
    //     json.cancelled_orders,
    //   ];
    // });

    // pdf.autoTable({
    //   // head: [head],
    //   body: [...body],
    // });

    // pdf.save("table.pdf");
    alert("coming...");
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
      `http://django-env-v1.eba-cveq8rvb.us-west-2.elasticbeanstalk.com/api/reports/get_vendor_kpi_report`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          start_date: formattedFirstDateStart,
          end_date: formattedFirstDateEnd,
          mode: 0,
          vendors: [],
        }),
      }
    )
      .then((response) => response.json())
      .then((data) => {
        setReportData(data);

        console.log(reportData);

        // Find the minimum and maximum values in the table

        const values = Object.values(reportData)
          .slice(1)
          .map((header) => Object.values(header));

        let rawData = values.map((arr) => arr.slice(0, arr.length - 1));

        let maxValues = [];
        let minValues = [];

        for (var i = 0; i < rawData.length; i++) {
          var minValue = Math.min(...rawData[i]);
          var maxValue = Math.max(...rawData[i]);

          minValues.push(minValue);
          maxValues.push(maxValue);
        }

        setMinValues(minValues);
        setMaxValues(maxValues);

        setLoading(false);
      })
      .catch((error) => {
        alert(error);
        setLoading(false);
      });
  }

  const [rows, setRows] = useState([]);

  let tableRows = [];

  if (loading) {
    return <Loading />;
  }

  return (
    <>
      <NavBar />

      <div className="container border border-4 border-dark  rounded p-2 mt-2 mb-2 w-50">
        <div className="row text-center bg-light ">
          <div className="col-md-6">
            <div className="container p-2  m-1">
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

      <div className="container text-center w-50">
        <div className="row mt-2 mb-2">
          <div className="col-md-4">
            <div
              className="container btn btn-light text-primary border border-2 border-secondary"
              onClick={getReport}
            >
              <b> Get Report</b>
            </div>
          </div>
          <div className="col-md-4">
            <div
              className="container btn btn-light text-success border border-2 border-secondary"
              onClick={() => {
                JSONToExcel(reportData, "ExampleFile");
              }}
            >
              <b> Export Excel</b>
            </div>
          </div>
          <div className="col-md-4">
            <div
              className="container btn btn-light text-danger border border-2 border-secondary"
              onClick={exportToPDF}
            >
              <b> Export PDF</b>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-md-3 p-0 m-0">
          <table className="table   table-bordered">
            <tbody className="text-center">
              {/* show only one column with all headers from the returned object */}
              {reportData.length === 0
                ? ""
                : Object.keys(reportData).map((header, index) => (
                    <tr
                      key={index}
                      style={{
                        minWidth: 400,
                        width: 400,
                        textAlign: "center",
                      }}
                    >
                      <th> {header} </th>
                    </tr>
                  ))}
            </tbody>
          </table>
        </div>
        <div className="col-md-9 p-0 m-0">
          <div className="table-responsive">
            <table className="table   table-bordered">
              <thead>
                <tr className="text-center ">
                  {/* view all of the selected days from the returned object by iterating throw it  */}
                  {reportData.length === 0
                    ? "Please Select Start and End Date and Press Get Report 😁"
                    : Object.values(reportData.Date).map((header, index) => [
                        <th
                          key={index}
                          style={{
                            minWidth: 200,
                            width: 200,
                            textAlign: "center",
                          }}
                        >
                          {header}
                        </th>,
                      ])}
                </tr>
              </thead>
              <tbody className="text-center">
                {reportData.length === 0
                  ? ""
                  : Object.values(reportData)
                      .slice(1)
                      .map((header, index) => [
                        <tr key={header}>
                          {Object.values(header).map((sh, si) => [
                            <td
                              key={si}
                              style={
                                si === Object.values(header).length - 1
                                  ? { fontWeight: "bold" }
                                  : colorScale(sh, si, header, index)
                              }
                            >
                              {sh}
                            </td>,
                          ])}
                        </tr>,
                      ])}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}

export default VendorKPIReport;
