import BootstrapTable from "react-bootstrap-table-next";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.css";
import paginationFactory from "react-bootstrap-table2-paginator";
import filterFactory, { textFilter } from "react-bootstrap-table2-filter";
import "react-bootstrap-table2-filter/dist/react-bootstrap-table2-filter.min.css";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import NoDataView from "../components/noData";
import supabase from "../supabase";
import Loading from "../components/loading";
import { Navbar } from "react-bootstrap";
import NavBar from "../components/navBar";
import { useLocation } from "react-router-dom";
import json2csv from "json2csv";
import * as Icon from "react-bootstrap-icons";
// Fields to show in the table, and what object properties in the data they bind to
const fields = [
  {
    dataField: "arName",
    text: "Vendor",
    sort: true,
    filter: textFilter(),
  },
  {
    dataField: "total",
    text: "New Users",
    sort: true,
    filter: textFilter(),
  },
];

function ReportView() {
  const navigate = useNavigate();
  const location = useLocation();

  const [loading, setLoading] = useState(false);

  const [data, setData] = useState([]);

  useEffect(() => {
    setLoading(true);
    fetch(location.state.url).then((response) =>
      response.json().then((data) => {
        console.log(data);
        setData(data);
        setLoading(false);
      })
    );
  }, []);

  //   const saveExcel = () => {
  //     saveAs(data, "excel-file");
  //   };

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
    console.log(rowIndex);
    if (row.total) {
      return { background: "rgb(255," + rowIndex * 4 + ", 0)", color: "white" };
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <>
      <div className="container-fluid bg-light rounded  p-2  text-center">
        <NavBar />
        {/* <div className="container text-center p-2 mt-2 bg-success text-light">
          <button
            className="btn btn-primary p-2 m-2 text-light border border-2 border-light"
            onClick={addRow}
          >
            Export To Google Sheet
          </button>{" "}
          Report Name : <b> {location.state.title} </b>{" "}
        </div> */}
        <BootstrapTable
          bordered={false}
          bootstrap4
          keyField="id"
          columns={fields}
          data={data}
          pagination={pagination}
          filter={filterFactory()}
          rowStyle={rowStyle}
        />
      </div>
    </>
  );
}

export default ReportView;
