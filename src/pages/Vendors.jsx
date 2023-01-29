import BootstrapTable from "react-bootstrap-table-next";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.css";
import paginationFactory from "react-bootstrap-table2-paginator";
import filterFactory, { textFilter } from "react-bootstrap-table2-filter";
import "react-bootstrap-table2-filter/dist/react-bootstrap-table2-filter.min.css";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import supabase from "../supabase";
import Loading from "../components/loading";
import NavBar from "../components/navBar";

// Fields to show in the table, and what object properties in the data they bind to
const fields = [
  {
    dataField: "enName",
    text: "enName",
    sort: true,
    filter: textFilter(),
  },
  {
    dataField: "account_manager",
    text: "Assigned To",
    sort: true,
    filter: textFilter(),
  },
];
function Vendors() {
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const [vendors, setVendors] = useState([]);

  async function getVendors() {
    setLoading(true);
    let { data: vendors, error } = await supabase.from("vendors").select("*");
    setVendors(vendors);
    setLoading(false);
  }

  const rowEvents = {
    onClick: (e, row, rowIndex) => {
      navigate("/vendor_details", {
        state: {
          id: row.id,
          enName: row.enName,
          account_manager: row.account_manager,
        },
      });
    },
  };

  const pagination = paginationFactory({
    page: 1,
    sizePerPage: 15,
    lastPageText: ">>",
    firstPageText: "<<",
    nextPageText: ">",
    prePageText: "<",
    showTotal: true,
    alwaysShowAllBtns: true,
  });

  useEffect(() => {
    getVendors();
  }, []);

  if (vendors.length === 0) {
  }

  if (loading) {
    return <Loading />;
  }

  return (
    <>
      <NavBar />

      <div className="container-fluid p-4 text-center">
        <BootstrapTable
          className="text-light"
          bordered={false}
          bootstrap4
          keyField="id"
          columns={fields}
          data={vendors}
          pagination={pagination}
          filter={filterFactory()}
          rowEvents={rowEvents}
        />
      </div>
    </>
  );
}
export { Vendors };

// export const data = data;
