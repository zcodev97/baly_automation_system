import "react-bootstrap-table-next/dist/react-bootstrap-table2.css";
import paginationFactory from "react-bootstrap-table2-paginator";
import "react-bootstrap-table2-filter/dist/react-bootstrap-table2-filter.min.css";
import React, { useEffect, useState } from "react";
import Loading from "../../components/loading";
import NavBar from "../../components/navBar";
import DatePickerCompo from "../../components/datePicker";
import ExcelExport from "../../components/excelExport";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

function CancellationReport() {
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
      <div className="container p-2 mt-2   border-2 border-bottom border-primary text-dark rounded">
        <h3 className="text-center">
          <b> Cancellation Report</b>{" "}
        </h3>
      </div>
      <div className="container border border-4 border-dark  rounded p-2 mt-5 mb-2">
        <div className="row text-center bg-light ">
          <div className="col-md-3">
            {DatePickerCompo("Start Date", startFirstDate, setStartFirstDate)}
          </div>
          <div className="col-md-3">
            {DatePickerCompo("End Date", endFirstDate, setEndFirstDate)}
          </div>

          <div className="col-md-3">
            <div
              className="container btn btn-light border border-primary text-primary"
              onClick={getReport}
            >
              <b> Get Report </b>
            </div>
          </div>
          <div className="col-md-3">
            {ExcelExport(
              data,
              "Cancellation_Report",
              startFirstDate,
              endFirstDate
            )}
          </div>
        </div>
      </div>

      <div className="table-responsive">
        <table className="table   table-bordered table-dark table-hover">
          <thead>
            <tr className="text-center">
              {/* view all of the selected days from the returned object by iterating throw it  */}
              {data.length === 0
                ? ""
                : Object.keys(data[0]).map((header, index) => [
                    <th
                      key={index}
                      style={{
                        minWidth: 100,
                        width: 100,
                        textAlign: "center",
                      }}
                    >
                      {header}
                    </th>,
                  ])}
            </tr>
          </thead>
          <tbody className="text-center">
            {data.length === 0 ? (
              <p className="text-dark">
                {" "}
                Please Select Start and End Date and Press Get Report 😁
              </p>
            ) : (
              Object.values(data).map((h, i) => [
                <tr key={i}>
                  {Object.values(h).map((sh, si) => (
                    <td key={si}>{sh}</td>
                  ))}
                </tr>,
              ])
            )}
          </tbody>
        </table>
      </div>

      <div className="container">
        <LineChart
          width={1000}
          height={300}
          data={Object.values(data)
            .slice(1, 0)
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
    </>
  );

  // date selection element
  // function dateSelectionElement(title, dateValue, setDateValue) {
  //   return (
  //     <div className="container p-2">
  //       {title}
  //       {"  "}
  //       <DateTimePicker
  //         key={2}
  //         clearIcon={null}
  //         format={"y-MM-dd"}
  //         onChange={setDateValue}
  //         value={dateValue}
  //       />
  //     </div>
  //   );
  // }
}

export default CancellationReport;
