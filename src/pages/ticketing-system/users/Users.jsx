import BootstrapTable from "react-bootstrap-table-next";

import "react-bootstrap-table-next/dist/react-bootstrap-table2.css";
import paginationFactory from "react-bootstrap-table2-paginator";
import filterFactory, { textFilter } from "react-bootstrap-table2-filter";
import "react-bootstrap-table2-filter/dist/react-bootstrap-table2-filter.min.css";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import supabase from "../../../supabase";
import Loading from "../../../components/loading";
import NoDataView from "../../../components/noData";
import NavBar from "../../../components/navBar";
import BACKEND_URL from "../../../global";
var fields = [
  {
    dataField: "username",
    text: "Username",
    sort: true,
    filter: textFilter(),
  },
  {
    dataField: "first_name",
    text: "First Name",
    sort: true,
    filter: textFilter(),
  },
  {
    dataField: "last_name",
    text: "Last Name",
    sort: true,
    filter: textFilter(),
  },
  {
    dataField: "email",
    text: "Email",
    sort: true,
    filter: textFilter(),
  },
  {
    dataField: "phone_number",
    text: "Phone Number",
    sort: true,
    filter: textFilter(),
  },
  {
    dataField: "rate",
    text: "Rate",
    sort: true,
    filter: textFilter(),
  },
];

function Users() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);

  async function getAllUsers() {
    setLoading(true);
    var token = localStorage.getItem("token");

    let res = await fetch(BACKEND_URL + "ticket_system/all_users", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    let users = await res.json();
    setUsers(users);
    setLoading(false);
  }

  const rowEvents = {
    onClick: (e, row, rowIndex) => {
      navigate("/user_details", {
        state: {
          id: row.id,
          email: row.email,
          username: row.username,
          firstName: row.first_name,
          lastName: row.last_name,
          phoneNumber: row.phone_number,
          role: row.role,
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
    getAllUsers();
  }, []);

  if (loading) {
    return <Loading />;
  }

  if (users.length === 0) {
    return <NoDataView />;
  }

  return (
    <>
      <NavBar />
      <div className="container w-75 bg-light rounded p-4 text-center">
        <BootstrapTable
          hover={true}
          bordered={false}
          keyField="id"
          columns={fields}
          data={users}
          pagination={pagination}
          filter={filterFactory()}
          rowEvents={rowEvents}
        />
      </div>
    </>
  );
}

export { Users, fields };
