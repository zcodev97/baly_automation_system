import { useEffect } from "react";
import Loading from "../../../components/loading";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import filterFactory, { textFilter } from "react-bootstrap-table2-filter";
import "react-bootstrap-table2-filter/dist/react-bootstrap-table2-filter.min.css";

function VoucherReport() {
  //get all of the records for the voucher report
  async function GetReport() {}

  useEffect(() => {
    GetReport();
  }, []);

  return <></>;
}

// Fields to show in the table, and what object properties in the data they bind to
const fields = [
  {
    dataField: "vendor",
    text: "Vendor",
    sort: true,
    filter: textFilter(),
    showTitle: false,
  },
  {
    dataField: "issue_type",
    text: "Issue Type",
    sort: true,
    filter: textFilter(),
  },
  {
    dataField: "order_id",
    text: "Order ID",
    sort: true,
    filter: textFilter(),
  },
  {
    dataField: "description",
    text: "Description",
    sort: true,
    filter: textFilter(),
  },
  {
    dataField: "assign_to",
    text: "Assign To",
    sort: true,
    filter: textFilter(),
  },
  {
    dataField: "priority",
    text: "Priority",
    sort: true,
    filter: textFilter(),
  },

  {
    dataField: "status",
    text: "Status",
    sort: true,
    filter: textFilter(),
  },
  {
    dataField: "created",
    text: "Created At",
    sort: true,
    filter: textFilter(),
    formatter: dateFormatter,
  },
  {
    dataField: "created_by",
    text: "Created By",

    sort: true,
    filter: textFilter(),
  },
  {
    dataField: "resolve_at",
    text: "Resolved At",
    sort: true,
    filter: textFilter(),
    formatter: dateFormatter,
  },
  {
    dataField: "resolve_by",
    text: "Resolved By",
    sort: true,
    filter: textFilter(),
  },
];

export default VoucherReport;
