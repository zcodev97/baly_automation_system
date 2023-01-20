import NavBar from "../components/navBar";
import DateTimePicker from "react-datetime-picker";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function ReportsPage() {
  const navigate = useNavigate();

  let className = "btn btn-dark text-white border border-3 border-white p-1";
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

  const options = {
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: true, // use 12-hour time format (am/pm)
  };

  let formattedStartDate = startDate.toLocaleString("en-US", options);
  let formattedEndDate = endDate.toLocaleString("en-US", options);

  function getMostNewCustomersPerVendor() {
    navigate("/get_report", {
      state: {
        title: "Most New Customers Per Vendor",
        url:
          "http://127.0.0.1:3001/most_new_customers_per_vendor?start_date=" +
          formattedStartDate +
          "&end_date=" +
          formattedEndDate,
      },
    });
  }

  function getMostSellingItemsPerVendor() {
    navigate("/most_selling", {
      state: {
        title: "Most Selling Items Per Vendor",
        url:
          "http://127.0.0.1:3001/most_selling_items_per_vendor?start_date=" +
          formattedStartDate +
          "&end_date=" +
          formattedEndDate,
      },
    });
  }

  return (
    <>
      <NavBar />
      <div className="container border border-2 rounded text-center z p-1 mt-2">
        <h3>
          <b> Reports</b>
        </h3>
      </div>

      <DateSelectorComponent />

      <div className="container text-center ">
        <div className="container p-3 bg-dark text-white rounded">
          <div className="row ">
            <div className="col-md-3">
              <button
                className={className}
                onClick={getMostNewCustomersPerVendor}
              >
                <b> Most New Customers Per Vendor </b>
              </button>
            </div>
            <div className="col-md-3">
              <button
                className={className}
                onClick={getMostSellingItemsPerVendor}
              >
                <b> New users weight per vendor </b>
              </button>
            </div>
            <div className="col-md-3">
              <button
                className={className}
                onClick={getMostSellingItemsPerVendor}
              >
                <b> Vendors Cancellation Weight </b>
              </button>
            </div>
            <div className="col-md-3">
              <button
                className={className}
                onClick={getMostSellingItemsPerVendor}
              >
                <b> Voucher Usage Per Device </b>
              </button>
            </div>
          </div>
        </div>
        <hr />

        <div className="container p-3 bg-dark text-white rounded ">
          <div className="row">
            <div className="col-md-4">
              <button
                className={className}
                onClick={getMostSellingItemsPerVendor}
              >
                <b> Commission Weight </b>
              </button>
            </div>
            <div className="col-md-4">
              <button
                className={className}
                onClick={getMostSellingItemsPerVendor}
              >
                <b> Weekly Commission </b>
              </button>
            </div>
            <div className="col-md-4">
              <button
                className={className}
                onClick={getMostSellingItemsPerVendor}
              >
                <b> Vendor Payment </b>
              </button>
            </div>
          </div>
        </div>

        <hr />

        <div className="container p-3 bg-dark text-white rounded ">
          <div className="row">
            <div className="col-sm-2">
              <button
                className={className}
                onClick={getMostSellingItemsPerVendor}
              >
                <b> DT overall </b>
              </button>
            </div>
            <div className="col-sm-2">
              <button
                className={className}
                onClick={getMostSellingItemsPerVendor}
              >
                <b> DT time out of zone</b>
              </button>
            </div>
            <div className="col-sm-2">
              <button
                className={className}
                onClick={getMostSellingItemsPerVendor}
              >
                <b> DT per cuisine </b>
              </button>
            </div>
            <div className="col-sm-2">
              <button
                className={className}
                onClick={getMostSellingItemsPerVendor}
              >
                <b> DT per vendor </b>
              </button>
            </div>
            <div className="col-sm-2">
              <button
                className={className}
                onClick={getMostSellingItemsPerVendor}
              >
                <b> DT for new users </b>
              </button>
            </div>
            <div className="col-sm-2">
              <button
                className={className}
                onClick={getMostSellingItemsPerVendor}
              >
                <b> DT for ppl who ordered again </b>
              </button>
            </div>
          </div>
        </div>
        <hr />
        <div className="container p-3 bg-dark text-white rounded ">
          <div className="row">
            <div className="col-sm-4">
              <button
                className={className}
                onClick={getMostSellingItemsPerVendor}
              >
                <b> Vendors ack time </b>
              </button>
            </div>
            <div className="col-sm-4">
              <button
                className={className}
                onClick={getMostSellingItemsPerVendor}
              >
                <b> CRM lists</b>
              </button>
            </div>
            <div className="col-sm-4">
              <button
                className={className}
                onClick={getMostSellingItemsPerVendor}
              >
                <b> CRM analysis </b>
              </button>
            </div>
          </div>
        </div>

        <hr />
      </div>
    </>
  );

  function DateSelectorComponent() {
    return (
      <div className="container border border-2    mt-2 mb-2 w-50 rounded">
        <div className="row text-center bg-light ">
          <div className="col-md-6">
            <div className="container p-2  m-1">
              <b> Start Date {"  "} </b>
              <DateTimePicker
                clearIcon={null}
                format={"y-MM-dd h:mm a"}
                onChange={setStartDate}
                value={startDate}
              />
            </div>
          </div>
          <div className="col-md-6">
            <div className="container p-2  m-1">
              <b> End Date {"  "} </b>
              <DateTimePicker
                clearIcon={null}
                format={"y-MM-dd h:mm a"}
                onChange={setEndDate}
                value={endDate}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ReportsPage;
