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
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  //convert json to excel
  const JSONToExcel = (jsonData, fileName) => {
    const worksheet = XLSX.utils.json_to_sheet(jsonData);
    const workbook = { Sheets: { data: worksheet }, SheetNames: ["data"] };
    XLSX.writeFile(workbook, `${fileName}.xlsx`);
  };

  function exportToPDF() {
    const pdf = new jsPDF();

    // const head = fields.map(function (json) {
    //   return [json.text];
    // });

    const body = data.map(function (json) {
      return [
        json.hour,
        json.gross_orders,
        json.net_orders,
        json.cancelled_orders,
      ];
    });

    pdf.autoTable({
      // head: [head],
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
      `http://django-env-v1.eba-cveq8rvb.us-west-2.elasticbeanstalk.com/api/reports/get_vendor_kpi_report?start_date=${formattedFirstDateStart}&end_date=${formattedFirstDateEnd}`,
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
        // data.forEach(function (jsonObject) {
        //   if (jsonObject.hour >= 0 && jsonObject.hour < 12) {
        //     jsonObject.hour = jsonObject.hour + "  " + "AM";
        //   } else {
        //     jsonObject.hour = jsonObject.hour + "  " + "PM";
        //   }
        // });
        setData(data);

        console.log(data);
        setLoading(false);
      })
      .catch((error) => {
        alert("Error In Adding new Comment 😕");
        setLoading(false);
      });
  }

  if (loading) {
    return <Loading />;
  }

  return (
    <>
      <NavBar />

      <div className="container border  rounded p-2 mt-2 mb-2 w-50">
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

      <div className="row text-center">
        <div className="col-md-4">
          <div
            className="container btn btn-primary border border-2 p-2"
            onClick={getReport}
          >
            <b> Get Report</b>
          </div>
        </div>
        <div className="col-md-4">
          <div
            className="container btn btn-success"
            onClick={() => {
              JSONToExcel(data, "ExampleFile");
            }}
          >
            <b> Export Excel</b>
          </div>
        </div>
        <div className="col-md-4">
          <div className="container btn btn-danger" onClick={exportToPDF}>
            <b> Export PDF</b>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-md-2">
          <Container>
            <Table className="table-fixed">
              <thead>
                <tr>
                  <th>Fixed Column</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Row 1</td>
                </tr>
              </tbody>
            </Table>
          </Container>
        </div>
        <div className="col-md-10">
          <Container>
            <Table responsive="xl" className="table-fixed table-responsive">
              <thead>
                <tr>
                  <th>Column 1</th>
                  <th>Column 2</th>
                  <th>Column 3</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Row 1 Column 1</td>
                  <td>Row 1 Column 2</td>
                  <td>Row 1 Column 3</td>
                </tr>
              </tbody>
            </Table>
          </Container>
        </div>
      </div>
    </>
  );
}

export default VendorKPIReport;
