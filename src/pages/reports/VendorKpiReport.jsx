// for excel and pdf
import * as XLSX from "xlsx";

import "react-bootstrap-table-next/dist/react-bootstrap-table2.css";
import "react-bootstrap-table2-filter/dist/react-bootstrap-table2-filter.min.css";
import React, { useEffect, useState } from "react";
import Loading from "../../components/loading";
import NavBar from "../../components/navBar";
import DateTimePicker from "react-datetime-picker";
import Select from "react-select";
import BACKEND_URL from "../../global";
import ExcelExport from "../../components/excelExport";
import DatePickerCompo from "../../components/datePicker";
function VendorKPIReport() {
  const [startFirstDate, setStartFirstDate] = useState(new Date());
  const [endFirstDate, setEndFirstDate] = useState(new Date());

  const [startSecondDate, setStartSecondDate] = useState(new Date());
  const [endSecondDate, setEndSecondDate] = useState(new Date());
  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(false);

  const [iscompareReport, setIsCompareReport] = useState(false);

  const [selectedMode, setSelectedMode] = useState(null);

  const modes = [
    { value: 0, label: "Date" },
    { value: 1, label: "Hour" },
    { value: 2, label: "Month" },
    { value: 3, label: "Year-Month" },
    { value: 4, label: "Week" },
    { value: 5, label: "Month-Week" },
    { value: 6, label: "Week-day" },
    { value: 7, label: "Year" },
    { value: 8, label: "Year-week" },
    { value: 9, label: "Area" },
  ];

  const zones = [
    { value: "Mansoor", label: "Mansoor" },
    { value: "Zayoona", label: "Zayoona" },
    { value: "Karrada", label: "Karrada" },
    { value: "Ahdamya", label: "Ahdamya" },
    { value: "Dora", label: "Dora" },
    { value: "Hay Al-Jameea", label: "Hay Al-Jameea" },
    { value: "Ameriya", label: "Ameriya" },
  ];

  const [selectedZones, setSelectedZones] = useState([]);

  const colorScale = (sh, si, header, index) => {
    // console.log(si);

    let returnedValue = Object.values(header);

    returnedValue.pop();

    let sortedValues = returnedValue.sort((a, b) => a - b);

    var minValue = Math.min(...sortedValues);
    var maxValue = Math.max(...sortedValues);

    const percentage = (sh - maxValue) / (minValue - maxValue);
    const cappedPercentage = Math.min(1, Math.max(0, percentage));
    const red = Math.round(255 * cappedPercentage);
    const green = Math.round(255 * (1 - cappedPercentage));

    sh = sh.toFixed(2);

    if (si === 4) {
      sh.toLocaleString("en-US", { style: "currency", currency: "USD" });
    }

    return {
      backgroundColor: `rgb(${red}, ${green}, 0)`,
    };
  };

  //convert json to excel
  const JSONToExcel = () => {
    let fileName = "";

    let formattedFirstStartDate = new Date(startFirstDate)
      .toISOString()
      .slice(0, 10);
    let formattedFirstEndDate = new Date(endFirstDate)
      .toISOString()
      .slice(0, 10);

    if (iscompareReport) {
      let formattedSecondStartDate = new Date(startSecondDate)
        .toISOString()
        .slice(0, 10);
      let formattedSecondEndDate = new Date(endSecondDate)
        .toISOString()
        .slice(0, 10);
      fileName = `Vendor_KPI_Report_Compare Period 1 (From - ${formattedFirstStartDate} to - ${formattedFirstEndDate})  to Period 2 (From - ${formattedSecondStartDate} to - ${formattedSecondEndDate})`;
    } else {
      fileName = `Vendor_KPI_Report (From - ${formattedFirstStartDate} to - ${formattedFirstEndDate})`;
    }

    if (reportData.length === 0) {
      alert("Please Select Date and press Get Report 😁");
      return;
    }

    const values = Object.values(reportData).map((header) =>
      Object.values(header)
    );
    const headers = Object.keys(reportData);

    let mergedObj = Object.assign({}, headers, values);

    const lastValues = Object.values(mergedObj).map((header) =>
      Object.values(header)
    );

    let titles = Object.keys(reportData).map((header, index) => header);

    for (let i = 0; i < lastValues.length; i++) {
      lastValues[i].unshift(titles[i]);
    }

    console.log(lastValues);

    const worksheet = XLSX.utils.json_to_sheet(lastValues);
    const workbook = { Sheets: { data: worksheet }, SheetNames: ["data"] };
    XLSX.writeFile(workbook, `${fileName}.xlsx`);
  };

  async function getReport() {
    setLoading(true);
    var token = localStorage.getItem("token");

    let formattedFirstDateStart = new Date(startFirstDate)
      .toISOString()
      .slice(0, 10);
    let formattedFirstDateEnd = new Date(endFirstDate)
      .toISOString()
      .slice(0, 10);
    let formattedStartSecondDate = new Date(startSecondDate)
      .toISOString()
      .slice(0, 10);
    let formattedEndSecondDate = new Date(endSecondDate)
      .toISOString()
      .slice(0, 10);

    if (iscompareReport) {
      fetch(
        `http://django-env-v1.eba-cveq8rvb.us-west-2.elasticbeanstalk.com/api/reports/get_vendor_kpi_comapare`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            start_date_first: formattedFirstDateStart,
            end_date_first: formattedFirstDateEnd,
            start_date_second: formattedStartSecondDate,
            end_date_second: formattedEndSecondDate,
            vendors: Object.values(selectedVendors).map((h, i) => h.value),
            zones: Object.values(selectedZones).map((h, i) => h.value),
          }),
        }
      )
        .then((response) => response.json())
        .then((data) => {
          setReportData(data);

          console.log(data);

          setLoading(false);
        })
        .catch((error) => {
          alert(error);
          setLoading(false);
        });
    }

    fetch(
      `http://django-env-v1.eba-cveq8rvb.us-west-2.elasticbeanstalk.com/api/reports/get_vendor_kpi_report`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          start_date: formattedFirstDateStart,
          end_date: formattedFirstDateEnd,
          mode:
            selectedMode === null || selectedMode === undefined
              ? 0
              : selectedMode.value,
          vendors: Object.values(selectedVendors).map((h, i) => h.value),
        }),
      }
    )
      .then((response) => response.json())
      .then((data) => {
        setReportData(data);

        setTimeout(() => {}, 1000);

        console.log(reportData);

        setLoading(false);
      })
      .catch((error) => {
        alert(error);
        setLoading(false);
      });
  }

  const [selectedVendors, setSelectedVendors] = useState([]);

  const [vendorsDropDownMenu, setVendorsDropDownMenu] = useState([]);
  const [vendors, setVendors] = useState([]);

  let dropVendors = [];

  async function loadVendors() {
    setLoading(true);

    var token = localStorage.getItem("token");

    let res = await fetch(BACKEND_URL + "reports/get_vendor_id", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    let vendors = await res.json();

    setVendors(vendors);
    vendors.forEach((vendor) => {
      dropVendors.push({
        label: vendor.vendor_title,
        value: vendor.vendor_id,
      });
    });
    setVendorsDropDownMenu(dropVendors);
    setLoading(false);
  }

  useEffect(() => {
    loadVendors();
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <>
      <NavBar />
      <div className="container p-2 mt-2   border-2 border-bottom border-primary text-dark rounded ">
        <div className="row d-flex justify-content-center align-items-center">
          <div className="col-md-6">
            <h3 className="text-center">
              <b> KPIs & Units Economics Report </b>
            </h3>
          </div>
          <div className="col-md-2 text-center">
            <div
              className="container btn btn-light text-primary border border-2 border-secondary"
              onClick={getReport}
            >
              <b> Get Report ✅</b>
            </div>
          </div>
          <div className="col-md-2 text-center">
            <div
              className="container btn btn-light text-success border border-2 border-secondary"
              onClick={() => {
                JSONToExcel(reportData);
              }}
            >
              <b> Export Excel ⬇️</b>
            </div>
          </div>
          <div className="col-md-2">
            <div
              className="container btn btn-light border border-danger border-3 "
              onClick={() => {
                setIsCompareReport(!iscompareReport);
              }}
            >
              {iscompareReport ? "Disable" : "Enable "} Compare Report
            </div>
          </div>
        </div>
      </div>
      <div className="container-fluid border border-3 rounded mt-2 mb-2">
        <div className="row d-flex justify-content-center align-items-center">
          <div className="col-md-6">
            <div className="row bg-light d-flex justify-content-center align-items-center">
              <div className="col-md-6">
                {DatePickerCompo(
                  "Start Date 1",
                  startFirstDate,
                  setStartFirstDate
                )}
                {iscompareReport
                  ? DatePickerCompo(
                      "Start Date 2",
                      startSecondDate,
                      setStartSecondDate
                    )
                  : ""}
              </div>
              <div className="col-md-6">
                {DatePickerCompo("End Date 1", endFirstDate, setEndFirstDate)}
                {iscompareReport
                  ? DatePickerCompo(
                      "End Date 2",
                      endSecondDate,
                      setEndSecondDate
                    )
                  : ""}
              </div>
            </div>
          </div>

          <div className="col-md-6 ">
            <div className="row d-flex justify-content-center align-items-center">
              <div className="col-md-4">
                <div className="container border-bottom border-light border-3  ">
                  <Select
                    defaultValue={selectedMode}
                    onChange={(opt) => setSelectedMode(opt)}
                    options={modes}
                    placeholder={"select mode.."}
                    isDisabled={iscompareReport ? true : false}
                  />
                </div>
              </div>
              <div className="col-md-4">
                <div className="container border-bottom border-light border-3 ">
                  <Select
                    defaultValue={selectedVendors}
                    options={vendorsDropDownMenu}
                    onChange={(opt) => setSelectedVendors(opt)}
                    isMulti
                    placeholder={"vendors.."}
                    isDisabled={iscompareReport ? true : false}
                  />
                </div>
              </div>
              <div className="col-md-4">
                <div className="container border-bottom border-light border-3  ">
                  <Select
                    defaultValue={selectedZones}
                    onChange={(opt) => setSelectedZones(opt)}
                    options={zones}
                    placeholder={"select zones.."}
                    isDisabled={iscompareReport ? false : true}
                    isMulti
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-md-3 p-0 m-0">
          <table className="table table-sm  table-bordered table-hover table-dark">
            <tbody className="text-center">
              {reportData.length === 0
                ? ""
                : Object.keys(reportData).map((header, index) => (
                    <tr
                      key={index}
                      style={{
                        minWidth: 400,
                        width: 400,
                        textAlign: "center",
                      }}
                    >
                      <th> {header} </th>
                    </tr>
                  ))}
            </tbody>
          </table>
        </div>
        <div className="col-md-9 p-0 m-0">
          <div className="table-responsive">
            <table className="table  table-sm table-bordered table-hover table-dark">
              <thead>
                <tr className="text-center ">
                  {reportData.length === 0 ? (
                    <th className="text-start ">
                      Please Select Start, End Date and Press Get Report 😁
                    </th>
                  ) : (
                    Object.values(Object.values(reportData)[0]).map(
                      (header, index) => [
                        <th
                          key={index}
                          style={{
                            minWidth: 200,
                            width: 200,
                            textAlign: "center",
                          }}
                        >
                          {header}
                        </th>,
                      ]
                    )
                  )}
                </tr>
              </thead>
              <tbody className="text-center">
                {reportData.length === 0
                  ? ""
                  : Object.values(reportData)
                      .slice(1)
                      .map((header, index) => [
                        <tr key={header}>
                          {Object.values(header).map((sh, si) => [
                            <td
                              key={si}
                              style={
                                si === Object.values(header).length - 1
                                  ? { fontWeight: "bold" }
                                  : colorScale(sh, si, header, index)
                              }
                            >
                              {index === 3
                                ? sh.toFixed(2) + " %"
                                : index === 4
                                ? sh.toFixed(2) + " %"
                                : index === 6
                                ? sh.toLocaleString("en-US", {
                                    style: "currency",
                                    currency: "USD",
                                  })
                                : index === 7
                                ? sh.toLocaleString("en-US", {
                                    style: "currency",
                                    currency: "USD",
                                  })
                                : index === 8
                                ? sh.toLocaleString("en-US", {
                                    style: "currency",
                                    currency: "USD",
                                  })
                                : index === 10
                                ? sh.toFixed(2) + " %"
                                : index === 11
                                ? sh.toLocaleString("en-US", {
                                    style: "currency",
                                    currency: "USD",
                                  })
                                : index === 12
                                ? sh.toFixed(2) + " %"
                                : index === 13
                                ? sh.toLocaleString("en-US", {
                                    style: "currency",
                                    currency: "USD",
                                  })
                                : index === 14
                                ? sh.toLocaleString("en-US", {
                                    style: "currency",
                                    currency: "USD",
                                  })
                                : index === 15
                                ? sh.toFixed(2) + " %"
                                : index === 17
                                ? sh.toFixed(2) + " %"
                                : index === 19
                                ? sh.toFixed(2) + " %"
                                : index === 20
                                ? sh.toLocaleString("en-US", {
                                    style: "currency",
                                    currency: "USD",
                                  })
                                : index === 21
                                ? sh.toLocaleString("en-US", {
                                    style: "currency",
                                    currency: "USD",
                                  })
                                : index === 22
                                ? sh.toFixed(2) + " %"
                                : index === 23
                                ? sh.toFixed(2) + ""
                                : index === 26
                                ? sh.toFixed(2) + " %"
                                : index === 30
                                ? sh.toFixed(5) + " %"
                                : sh.toFixed(2)}
                            </td>,
                          ])}
                        </tr>,
                      ])}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}

export default VendorKPIReport;
