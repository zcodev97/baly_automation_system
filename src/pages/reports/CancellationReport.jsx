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

function CancellationReport() {
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
    alert("coming... 😁");

    // const pdf = new jsPDF();

    // const head = Object.keys(data[0]).map((k) => [k]);

    // const body = Object.values(data[0]).map((k) => k);

    // pdf.autoTable({
    //   head: [head],
    //   body: [...body],
    // });

    // pdf.save("table.pdf");
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

    if (formattedFirstDateStart === formattedFirstDateEnd) {
      alert("Please Select Correct Date");
      setLoading(false);

      return;
    }

    fetch(
      `http://django-env-v1.eba-cveq8rvb.us-west-2.elasticbeanstalk.com/api/reports/get_cancellation_report?start_date=${formattedFirstDateStart}&end_date=${formattedFirstDateEnd}`,
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
        alert(error);
        setLoading(false);
      });
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

  const fields =
    data.length === 0
      ? []
      : Object.keys(data[0]).map((k) => ({
          dataField: k,
          text: k,
          showTitle: false,
        }));

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

      <div className="container text-center ">
        <button
          className="btn btn-light text-primary border border-3 rounded border-secondary p-2 m-2"
          onClick={getReport}
        >
          <b> Get Report </b>
        </button>
      </div>
      <div className="table-responsive">
        <div className="table-responsive">
          <table className="table   table-bordered">
            <thead>
              <tr className="text-center">
                {/* view all of the selected days from the returned object by iterating throw it  */}
                {data.length === 0
                  ? ""
                  : Object.keys(data[0]).map((header, index) => [
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
              <tr>
                {data.length === 0
                  ? "Please Select Start and End Date and Press Get Report 😁"
                  : Object.values(data[0]).map((header, index) => [
                      <td key={header}>{header}</td>,
                    ])}
              </tr>
            </tbody>
          </table>
        </div>
      </div>

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
    </>
  );
}

export default CancellationReport;
