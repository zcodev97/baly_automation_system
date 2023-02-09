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
import BACKEND_URL from "../global";

// Fields to show in the table, and what object properties in the data they bind to
const fields = [
  {
    dataField: "vendor_title",
    text: "Vendor",
    sort: true,
    filter: textFilter(),
  },
  {
    dataField: "account_manager_username",
    text: "Account Manager",
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
    var token = localStorage.getItem("token");

    let res = await fetch(BACKEND_URL + "account_manager/get_vendor_am", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    let vendors = await res.json();
    setVendors(vendors);
    setLoading(false);
  }

  const rowEvents = {
    onClick: (e, row, rowIndex) => {
      navigate("/vendor_details", {
        state: {
          id: row.id,
          account_manager_id: row.account_manager_id,
          account_manager_username: row.account_manager_username,
          vendor_title: row.vendor_title,
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
          hover={true}
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
