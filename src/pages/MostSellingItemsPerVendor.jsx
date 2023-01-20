import BootstrapTable from "react-bootstrap-table-next";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.css";
import paginationFactory from "react-bootstrap-table2-paginator";
import filterFactory, { textFilter } from "react-bootstrap-table2-filter";
import "react-bootstrap-table2-filter/dist/react-bootstrap-table2-filter.min.css";
// import ToolkitProvider, { CSVExport } from "react-bootstrap-table2-toolkit";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import NoDataView from "../components/noData";
import supabase from "../supabase";
import Loading from "../components/loading";
import { Navbar } from "react-bootstrap";
import NavBar from "../components/navBar";
import { useLocation } from "react-router-dom";

// import { saveAs } from "json-to-excel";

// Fields to show in the table, and what object properties in the data they bind to
const fields = [
  {
    dataField: "vendor_id",
    text: "Vendor ID",
    sort: true,
    filter: textFilter(),
  },
  {
    dataField: "vendor_name",
    text: "vendor_name",
    sort: true,
    filter: textFilter(),
  },
  {
    dataField: "item_price",
    text: "item_price",
    sort: true,
    filter: textFilter(),
  },
  {
    dataField: "item",
    text: "item",
    sort: true,
    filter: textFilter(),
  },
  {
    dataField: "net_of_selling_item",
    text: "net_of_selling_item",
    sort: true,
    filter: textFilter(),
  },
  {
    dataField: "nvm",
    text: "nvm",
    sort: true,
    filter: textFilter(),
  },
  {
    dataField: "aov_of_top_selling_item",
    text: "aov_of_top_selling_item",
    sort: true,
    filter: textFilter(),
  },
];

function MostSellingItemsPerVendor() {
  // const { ExportCSVButton } = CSVExport;

  const navigate = useNavigate();
  const location = useLocation();

  console.log(location.state.url);

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
    sizePerPage: 15,
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
    // if (rowIndex) {
    //   parseInt(row.total);
    // }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <>
      <div className="container-fluid bg-light rounded  p-2  text-center">
        <NavBar />
        <div className="container text-center p-2 mt-2 bg-success text-light">
          {" "}
          Report Name : <b> {location.state.title} </b>{" "}
        </div>
        <div className="container">
          {/* <div className="container bg-dark p-3 m-3">
            <ToolkitProvider
              keyField="id"
              data={data}
              columns={fields}
              exportCSV
            >
              {(props) => (
                <div>
                  <ExportCSVButton {...props.csvProps}>
                    Export CSV!!
                  </ExportCSVButton>
                  <hr />
                  <BootstrapTable {...props.baseProps} />
                </div>
              )}
            </ToolkitProvider>
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
      </div>
    </>
  );
}

export default MostSellingItemsPerVendor;
