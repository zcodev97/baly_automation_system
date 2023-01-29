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

function HourlyReportPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [startFirstDate, setStartFirstDate] = useState(new Date());
  const [endFirstDate, setEndFirstDate] = useState(new Date());
  const [data, setData] = useState([]);

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
        // data.forEach(function (jsonObject) {
        //   if (jsonObject.hour >= 0 && jsonObject.hour < 12) {
        //     jsonObject.hour = jsonObject.hour + "  " + "AM";
        //   } else {
        //     jsonObject.hour = jsonObject.hour + "  " + "PM";
        //   }
        // });
        setData(data);
        setLoading(false);
      })
      .catch((error) => {
        alert("Error In Adding new Comment 😕");
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

  const rowStyle = (row, rowIndex) => {
    // if(row.created_at){
    //     return row.created_at.toLocaleDateString()
    // }
    if (row.hour >= 0 && row.hour < 12) {
      return { color: "white", background: "#40916c", fontWeight: "bold" };
    } else {
      return { color: "black", background: "#40916c", fontWeight: "bold" };
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <>
      <NavBar />
      {/* first date */}
      <div className="container     mt-2 mb-2 w-50">
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

export default HourlyReportPage;
