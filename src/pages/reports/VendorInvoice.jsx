import jsPDF from "jspdf";
import NavBar from "../../components/navBar";
import AmiriRegular from "./Amiri-Regular.ttf";
import DateTimePicker from "react-datetime-picker";
import { useState } from "react";
import Select from "react-select";
import BACKEND_URL from "../../global";
import { useEffect } from "react";
import Loading from "../../components/loading";

function VendorInvoiceReport() {
  const [startFirstDate, setStartFirstDate] = useState(new Date());
  const [endFirstDate, setEndFirstDate] = useState(new Date());
  const [data, setData] = useState([]);

  const [loading, setLoading] = useState(false);

  async function getReport() {
    setLoading(true);
    var token = localStorage.getItem("token");

    let formattedFirstDateStart = new Date(startFirstDate)
      .toISOString()
      .slice(0, 10);
    let formattedFirstDateEnd = new Date(endFirstDate)
      .toISOString()
      .slice(0, 10);

    if (selectedVendor === null || selectedVendor === undefined) {
      alert("please select a vendor ");
      return;
    }

    fetch(
      `http://django-env-v1.eba-cveq8rvb.us-west-2.elasticbeanstalk.com/api/reports/get_vendor_invoice?start_date=${formattedFirstDateStart}&end_date=${formattedFirstDateEnd}&vendor_id=${selectedVendor}`,
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
        alert("Error In Adding new Comment 😕");
        setLoading(false);
      });
  }

  function exportToPDF() {
    const pdf = new jsPDF("landscape");

    pdf.addFileToVFS("Amiri-Regular.ttf", AmiriRegular);
    pdf.addFont("/Amiri-Regular.ttf", "Amiri", "normal");
    pdf.setFont("Amiri");

    pdf.autoTable({
      head: [["WWW.BALY.IQ", "BALY FOOD"]],
      body: [],
    });

    pdf.autoTable({
      head: [["Vendor payment", "Total:", "256,000"]],
      body: [["Hermoonis Piri", "Final", "207,100", "Date", "1-15/1/2023"]],
    });
    pdf.autoTable({
      head: [
        [
          "created_at",
          "name",
          "commission",
          "title",
          "sub_total",
          "sub_total_discount",
          "raw_value",
          "baly_share",
          "vendor_share",
          "baly_commmission",
          "final_payment",
        ],
      ],
      body: [
        [
          "2023-01-01",
          "Hussam Bilal",
          "20",
          "Hermoonis Piri",
          "5500",
          "0",
          "5500",
          "0",
          "0",
          "1100",
          "4400",
        ],
        [
          "2023-01-02",
          "Hussam Bilal",
          "20",
          "Hermoonis Piri",
          "5500",
          "0",
          "5500",
          "0",
          "0",
          "1100",
          "5000",
        ],
        [
          "2023-01-03",
          "Hussam Bilal",
          "20",
          "Hermoonis Piri",
          "5500",
          "0",
          "5500",
          "0",
          "0",
          "1100",
          "9500",
        ],
      ],
    });

    pdf.save("table.pdf");
  }

  const [selectedVendor, setSelectedVendor] = useState(null);

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
        <h3 className="text-center" id="test">
          <b> Vendor Invoice </b>
        </h3>
        <div className="container border  rounded p-4 mt-2 mb-2 ">
          <div className="row">
            <div className="col-md-3">
              <div className="container   ">
                Start Date{"  "}
                <DateTimePicker
                  key={1}
                  clearIcon={null}
                  format={"y-MM-dd"}
                  onChange={setStartFirstDate}
                  value={startFirstDate}
                />
              </div>
            </div>
            <div className="col-md-3">
              <div className="container   ">
                End Date{"  "}
                <DateTimePicker
                  key={2}
                  clearIcon={null}
                  format={"y-MM-dd"}
                  onChange={setEndFirstDate}
                  value={endFirstDate}
                />
              </div>
            </div>
            <div className="col-md-3">
              <div className="container border-bottom border-light border-3  ">
                <Select
                  options={vendorsDropDownMenu}
                  onChange={(opt) => setSelectedVendor(opt.value)}
                  placeholder={"vendors.."}
                />
              </div>
            </div>
            <div className="col-md-3">
              <div
                className="container btn btn-light border border-2 border-primary text-primary"
                onClick={getReport}
              >
                <b> Get Report</b>
              </div>
            </div>
          </div>
        </div>

        <div className="table-responsive">
          <table className="table  table-sm table-bordered table-hover table-dark">
            <thead>
              <tr className="text-center ">
                {data.length === 0 ? (
                  <th className="text-start ">
                    Please Select Start and End Date and Press Get Report 😁
                  </th>
                ) : (
                  Object.keys(Object.values(data)[0]).map((header, index) => [
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
                  ])
                )}
              </tr>
            </thead>
            <tbody className="text-center">
              {data.length === 0
                ? ""
                : Object.values(data)
                    .slice(0, 3)
                    .map((header, index) => [
                      <tr key={header}>
                        {Object.values(header).map((sh, si) => [
                          <td key={si}>{sh}</td>,
                        ])}
                      </tr>,
                    ])}
            </tbody>
          </table>
        </div>

        <div className="container text-center">
          <div
            className="btn btn-light border-success text-priamry  text-center"
            onClick={exportToPDF}
          >
            Get Invoice
          </div>
        </div>
      </div>
    </>
  );
}

export default VendorInvoiceReport;
