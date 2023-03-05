import jsPDF from "jspdf";
import NavBar from "../../components/navBar";
import DateTimePicker from "react-datetime-picker";
import { useState } from "react";
import Select from "react-select";
import { BACKEND_URL, CheckUserPermissions } from "../../global";
import { useEffect } from "react";
import Loading from "../../components/loading";
import { useNavigate } from "react-router-dom";
import font from "./Amiri-Regular-normal";

function VendorInvoiceReport() {
  const navigate = useNavigate();

  const [startFirstDate, setStartFirstDate] = useState(new Date());
  const [endFirstDate, setEndFirstDate] = useState(new Date());
  const [data, setData] = useState([]);

  const [loading, setLoading] = useState(false);

  function exportToPDF() {
    const pdf = new jsPDF("landscape");

    let formattedFirstDateStart = new Date(startFirstDate)
      .toISOString()
      .slice(0, 10);
    let formattedFirstDateEnd = new Date(endFirstDate)
      .toISOString()
      .slice(0, 10);

    pdf.addFileToVFS("Amiri-Regular-normal.ttf", font);
    pdf.addFont("Amiri-Regular-normal.ttf", "Amiri-Regular", "normal");

    pdf.setFont("Amiri-Regular", "normal");

    pdf.autoTable({
      head: [["WWW.BALY.IQ", "BALY FOOD"]],
    });

    pdf.autoTable({
      head: [["Vendor payment", "   ", "   "]],
      body: [
        ["  ", "Total:", data[data.length - 1].raw_value.toLocaleString()],

        ["   ", "Final", data[data.length - 1].to_be_paid.toLocaleString()],

        ["   ", "Start", formattedFirstDateStart],

        ["   ", "End", formattedFirstDateEnd],
      ],
      styles: {
        fontSize: 12,
        fontStyle: "bold",
      },
    });
    pdf.autoTable({
      head: [[" ", selectedVendor.label, " "]],
      body: [[" ", " ", " "]],
      styles: {
        font: "Amiri-Regular",
        fontSize: 16,
        fontStyle: "bold",
      },
    });

    pdf.autoTable({
      head: [
        Object.keys(Object.values(data)[0]).map((header, index) => header),
      ],
      body: Object.values(data).map((header, index) =>
        Object.values(header).map((sh, si) => sh)
      ),
      styles: {
        font: "Amiri-Regular",
        fontSize: 10,
        fontStyle: "bold",
      },
      headStyles: {
        fontStyle: "bold",
      },

      didParseCell: function (data) {
        if (data.row.index === 0) {
          // Set style for header cells

          data.cell.styles.halign = "center"; // Text alignment for header cells
        } else {
          // Set style for data cells

          data.cell.styles.halign = "center"; // Text alignment for data cells
        }
      },
    });

    pdf.save(
      `Invoice - ${selectedVendor.label} - from ${formattedFirstDateStart}- to ${formattedFirstDateEnd}.pdf`
    );
  }

  async function getReport() {
    setLoading(true);

    if (selectedVendor.length === 0) {
      alert("Please Select Vendor !");
      setLoading(false);

      return;
    }
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
      `http://django-env-v1.eba-cveq8rvb.us-west-2.elasticbeanstalk.com/api/reports/get_vendor_invoice?start_date=${formattedFirstDateStart}&end_date=${formattedFirstDateEnd}&vendor_id=${selectedVendor.value}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    )
      .then((response) => {
        if (response.status !== 200) {
          alert("You Don't have Permission to get this report");
          setData([]);
          setLoading(false);
          return response.status;
        }
        return response.json();
      })
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

  const [selectedVendor, setSelectedVendor] = useState("");

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

    if (res.status !== 200) {
      alert("You Don't have Permission to get this report");
      setLoading(false);

      navigate("/home");

      return null;
    }

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

      <div className="container-fluid p-2 mt-2   border-2 border-bottom border-primary text-dark rounded ">
        <h3 className="text-center" id="test">
          <b> Vendor Invoice </b>
        </h3>
        <div className="container border  rounded p-4 mt-2 mb-2 ">
          <div className="row">
            <div className="col-md-2">
              <div className="container   ">
                Start
                <DateTimePicker
                  key={1}
                  clearIcon={null}
                  format={"y-MM-dd"}
                  onChange={setStartFirstDate}
                  value={startFirstDate}
                />
              </div>
            </div>
            <div className="col-md-2">
              <div className="container   ">
                End
                <DateTimePicker
                  key={2}
                  clearIcon={null}
                  format={"y-MM-dd"}
                  onChange={setEndFirstDate}
                  value={endFirstDate}
                />
              </div>
            </div>
            <div className="col-md-4">
              <div className="container border-bottom border-light border-3  ">
                <Select
                  defaultValue={selectedVendor}
                  options={vendorsDropDownMenu}
                  onChange={(opt) => setSelectedVendor(opt)}
                  placeholder={"vendors.."}
                />
              </div>
            </div>
            <div className="col-md-2">
              <div
                className="container btn btn-light border border-2 border-primary text-primary"
                onClick={getReport}
              >
                <b> Get Report</b>
              </div>
            </div>
            <div className="col-md-2">
              <div className="container text-center">
                <div
                  className="container btn border border-2  border-danger text-danger  text-center"
                  onClick={exportToPDF}
                >
                  <b> Export Invoice 📁 </b>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="table-responsive border ">
          <div
            className="container-fluid"
            style={{ height: 500, overflow: "auto" }}
          >
            <table className="table table-sm table-bordered table-hover">
              <thead style={{ position: "sticky", top: 0 }}>
                <tr className="text-center  bg-dark text-light ">
                  {data.length === 0 ? (
                    <th className="text-start ">
                      Please Select Start and End Date and Press Get Report 😁
                    </th>
                  ) : (
                    Object.keys(Object.values(data)[0]).map((header, index) => [
                      <th
                        key={index}
                        style={{
                          minWidth: 100,
                          width: 100,
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
                  : Object.values(data).map((header, index) => [
                      <tr key={header}>
                        {Object.values(header).map((sh, si) => [
                          <td
                            key={si}
                            className={
                              index === data.length - 1
                                ? "bg-dark text-light"
                                : "text-dark"
                            }
                          >
                            {sh}
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

export default VendorInvoiceReport;
