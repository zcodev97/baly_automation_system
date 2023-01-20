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
var fields = [
  // {
  //   dataField: "id",
  //   text: "ID",
  //   sort: true,
  //   filter: textFilter(),
  // },
  {
    dataField: "email",
    text: "Email",
    sort: true,
    filter: textFilter(),
  },
  {
    dataField: "username",
    text: "username",
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
    dataField: "phone_number",
    text: "Is Active",
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
    let { data: users, error } = await supabase.from("users").select("*");

    for (let index = 0; index < users.length; index++) {
      const element = users[index];
      if (element.user_type === 1) {
        users[index].user_type = "admin";
      }
      if (element.user_type === 2) {
        users[index].user_type = "Account Manager";
      }
      if (element.user_type === 3) {
        users[index].user_type = "CC";
      }
    }

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
          userPermissions: row.user_permissions,
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

  function goToAddUserPage() {}

  async function GetAllUsersFromDB() {
    let token = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwayI6IjczZjExZGI5LTc2ZTQtNDFiYy05ZTk1LTZkZTkwMmJiNDQyMCJ9.uV8tQj6lcTM4JSySi-PkE97qqmacVgNgMjACn2K6Fg0`;

    let res = await fetch(
      "http://10.11.12.181:8000/api/ticket_system/all_users",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    let users = await res.json();
    setUsers(users);
  }

  useEffect(() => {
    GetAllUsersFromDB();
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
      <div className="container-fluid bg-light rounded p-4 text-center">
        <BootstrapTable
          bootstrap4
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
