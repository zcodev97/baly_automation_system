import { useNavigate } from "react-router-dom";
import NavBar from "../components/navBar";
import React, { useState, useEffect } from "react";
import Loading from "../components/loading";
import { BACKEND_URL } from "../global";
import redArrow from "../arrow-trend-down.png";
import greenArrow from "../arrow-trend-up.png";

function HomePage() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [grossClassName, setGrossClassName] = useState("");

  const containerClassNameGauge =
    "container p-2 text-center text-light  border border-light border-1 rounded ";

  const cardStyle = { backgroundColor: "#0b2e34", height: 200, width: 200 };

  const [data, setData] = useState([
    {
      date: "today",
      net: 0,
      ff: 0,
      gross: 0,
      cancel: 0,
      NMV: 0,
      DF: 0,
      signups: 0,
      new_user: 0,
      blocked_user: 0,
    },
    {
      date: "yesterday",
      net: 0,
      ff: 0,
      gross: 0,
      cancel: 0,
      NMV: 0,
      DF: 0,
      signups: 0,
      new_user: 0,
      blocked_user: 0,
    },
    {
      date: "Diff",
      net: 0,
      ff: 0,
      gross: 0,
      cancel: 0,
      NMV: 0,
      DF: 0,
      signups: 0,
      new_user: 0,
      blocked_user: 0,
    },
  ]);

  function GetNEwCustomersReport() {
    navigate("/get_new_customers_report");
  }
  function GetHourlyReport() {
    navigate("/get_hourly_report");
  }
  function GetVendorKPIReport() {
    navigate("/get_vendor_kpi_report");
  }

  async function getAllVendorsForCurrentAccountManager() {
    var token = localStorage.getItem("token");

    fetch(BACKEND_URL + `reports/get_realtime_datas`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setData(data);
        setLoading(false);
      })
      .catch((error) => {
        // alert(error);
        console.log(error);
        setLoading(false);
      });
  }

  useEffect(() => {
    setLoading(true);

    var token = localStorage.getItem("token");

    // console.log(token);

    if (token === "" || token === null || token === undefined) {
      navigate("/login", { replace: true });
      setLoading(false);

      return;
    }

    getAllVendorsForCurrentAccountManager();
    setInterval(() => getAllVendorsForCurrentAccountManager(), 60000);
  }, []);

  function FirstRow() {
    return (
      <div className="row mt-1 p-1">
        <div className="col-md-2 mb-1">
          <div className={containerClassNameGauge} style={cardStyle}>
            <h4>
              <b> Gross</b>
            </h4>
            <h1
              className={
                Number(data[2].gross) > 0 ? "text-success" : "text-danger"
              }
            >
              <b>{data[0].gross} </b>
            </h1>
            <h6 className=""> Yesterday {data[1].gross} </h6>
            <h4
              className={
                Number(data[2].gross) > 0 ? "text-success" : "text-danger"
              }
            >
              <b>
                {Number(data[2].gross) > 0 ? (
                  <img src={greenArrow} height={25} alt="" srcset="" />
                ) : (
                  <img src={redArrow} height={25} alt="" srcset="" />
                )}
                {"  "}
                {Number(data[2].gross).toFixed(2) + " %"}{" "}
              </b>
            </h4>
          </div>
        </div>
        <div className="col-md-2 mb-1">
          <div className={containerClassNameGauge} style={cardStyle}>
            <h4>
              <b> FF</b>
            </h4>
            <h1
              className={
                Number(data[0].ff) > 0 ? "text-success" : "text-danger"
              }
            >
              {Number(data[0].ff).toFixed(2) + " %"}
            </h1>
            <h6 className="">
              {" "}
              Yesterday {Number(data[1].ff).toFixed(2) + " %"}{" "}
            </h6>
            <h4
              className={
                Number(data[2].ff) > 0 ? "text-success" : "text-danger"
              }
            >
              <b>
                {" "}
                {Number(data[2].ff) > 0 ? (
                  <img src={greenArrow} height={25} alt="" srcset="" />
                ) : (
                  <img src={redArrow} height={25} alt="" srcset="" />
                )}
                {"  "} {Number(data[2].ff).toFixed(2) + " %"}{" "}
              </b>
            </h4>
          </div>
        </div>

        <div className="col-md-2  mb-1">
          <div className={containerClassNameGauge} style={cardStyle}>
            <h3>
              <b>NET </b>
            </h3>
            <h1
              className={
                Number(data[2].net) > 0 ? "text-success" : "text-danger"
              }
            >
              {data[0].net}
            </h1>
            <h6 className=""> Yesterday {data[1].net} </h6>
            <h4
              className={
                Number(data[2].net) > 0 ? "text-success" : "text-danger"
              }
            >
              <b>
                {" "}
                {Number(data[2].net) > 0 ? (
                  <img src={greenArrow} height={25} alt="" srcset="" />
                ) : (
                  <img src={redArrow} height={25} alt="" srcset="" />
                )}
                {"  "} {Number(data[2].net).toFixed(2) + " %"}{" "}
              </b>
            </h4>
          </div>
        </div>

        <div className="col-md-2 mb-1">
          <div className={containerClassNameGauge} style={cardStyle}>
            <h3>
              <b>DF </b>
            </h3>
            <h1
              className={
                Number(data[2].DF) > 0 ? "text-success" : "text-danger"
              }
            >
              {Math.round(data[0].DF).toLocaleString() + " $"}
            </h1>
            <h6 className="">
              Yesterday {Math.round(data[1].DF).toLocaleString() + " $"}
            </h6>
            <h4
              className={
                Number(data[2].DF) > 0 ? "text-success" : "text-danger"
              }
            >
              <b>
                {" "}
                {Number(data[2].DF) > 0 ? (
                  <img src={greenArrow} height={25} alt="" srcset="" />
                ) : (
                  <img src={redArrow} height={25} alt="" srcset="" />
                )}
                {"  "} {Number(data[2].DF).toFixed(2) + " %"}
              </b>
            </h4>
          </div>
        </div>
        <div className="col-md-2 mb-1">
          <div className={containerClassNameGauge} style={cardStyle}>
            <h3>
              <b> NMV</b>
            </h3>
            <h1
              className={
                Number(data[2].NMV) > 0 ? "text-success" : "text-danger"
              }
            >
              {Math.round(data[0].NMV).toLocaleString() + " $"}
            </h1>
            <h6 className="">
              Yesterday {Math.round(data[1].NMV).toLocaleString() + " $"}
            </h6>
            <h4
              className={
                Number(data[2].NMV) > 0 ? "text-success" : "text-danger"
              }
            >
              <b>
                {" "}
                {Number(data[2].NMV) > 0 ? (
                  <img src={greenArrow} height={25} alt="" srcset="" />
                ) : (
                  <img src={redArrow} height={25} alt="" srcset="" />
                )}
                {"  "} {Number(data[2].NMV).toFixed(2) + " %"}{" "}
              </b>
            </h4>
          </div>
        </div>
        <div className="col-md-2 mb-1">
          <div className={containerClassNameGauge} style={cardStyle}>
            <h3>
              <b> Sign Ups</b>
            </h3>
            <h1
              className={
                Number(data[2].signups) > 0 ? "text-success" : "text-danger"
              }
            >
              {data[0].signups}
            </h1>
            <h6 className="">Yesterday {data[1].signups}</h6>
            <h4
              className={
                Number(data[2].signups) > 0 ? "text-success" : "text-danger"
              }
            >
              <b>
                {" "}
                {Number(data[2].signups) > 0 ? (
                  <img src={greenArrow} height={25} alt="" srcset="" />
                ) : (
                  <img src={redArrow} height={25} alt="" srcset="" />
                )}
                {"  "} {Number(data[2].signups).toFixed(2) + " %"}{" "}
              </b>
            </h4>
          </div>
        </div>
      </div>
    );
  }

  function SecondRow() {
    return (
      <div className="row mt-1 p-1">
        <div className="col-md-2 mb-1">
          <div className={containerClassNameGauge} style={cardStyle}>
            <h3>
              <b>New User </b>
            </h3>
            <h1
              className={
                Number(data[2].new_user) > 0 ? "text-success" : "text-danger"
              }
            >
              {data[0].new_user}
            </h1>
            <h6 className="">Yesterday {data[1].new_user}</h6>
            <h4
              className={
                Number(data[2].new_user) > 0 ? "text-success" : "text-danger"
              }
            >
              <b>
                {Number(data[2].new_user) > 0 ? (
                  <img src={greenArrow} height={25} alt="" srcset="" />
                ) : (
                  <img src={redArrow} height={25} alt="" srcset="" />
                )}
                {Number(data[2].new_user).toFixed(2) + " %"}{" "}
              </b>
            </h4>
          </div>
        </div>
        <div className="col-md-2 mb-1">
          <div className={containerClassNameGauge} style={cardStyle}>
            <h3>
              <b>Blocked Users </b>
            </h3>
            <h1
              className={
                Number(data[2].blocked_user) > 0
                  ? "text-success"
                  : "text-danger"
              }
            >
              {data[0].blocked_user}
            </h1>
            <h6 className="">Yesterday {data[1].blocked_user}</h6>
            <h4
              className={
                Number(data[2].blocked_user) > 0
                  ? "text-success"
                  : "text-danger"
              }
            >
              <b>
                {Number(data[2].blocked_user) > 0 ? (
                  <img src={greenArrow} height={25} alt="" srcset="" />
                ) : (
                  <img src={redArrow} height={25} alt="" srcset="" />
                )}
                {Number(data[2].blocked_user).toFixed(2) + " %"}
              </b>
            </h4>
          </div>
        </div>

        <div className="col-md-2 mb-1">
          <div className={containerClassNameGauge} style={cardStyle}>
            <h3>
              <b> Cancel</b>
            </h3>
            <h1
              className={
                Number(data[0].cancel) < Number(data[1].cancel)
                  ? "text-success"
                  : "text-danger"
              }
            >
              {data[0].cancel}
            </h1>
            <h6 className="">Yesterday {data[1].cancel}</h6>
            <h4
              className={
                Number(data[2].cancel) > 0 ? "text-success" : "text-danger"
              }
            >
              <b>
                {" "}
                {Number(data[2].cancel) > 0 ? (
                  <img src={greenArrow} height={25} alt="" srcset="" />
                ) : (
                  <img src={redArrow} height={25} alt="" srcset="" />
                )}
                {"  "} {Number(data[2].cancel).toFixed(2) + " %"}
              </b>
            </h4>
          </div>
        </div>
        <div className="col-md-2 mb-1"></div>
      </div>
    );
  }

  return (
    <>
      <NavBar />
      {loading ? <Loading /> : pageBody()}
    </>
  );

  function pageBody() {
    return (
      <div className="container-fluid m-0 p-0">
        <div className="container-fluid bg-dark rounded">
          <div
            className="container text-light text-center bg-dark p-2 rounded mt-4"
            style={{ backgroundColor: "#041d21" }}
          >
            <div className="container text-center text-light mt-2 mb-2 p-2 border border-light  rounded ">
              <h2>
                <b>Real Time Dashboard</b>
              </h2>
            </div>
            {FirstRow()}
            {/*  */}
            {SecondRow()}
            {/*  */}

            <hr className="mt-2" />
            <div className="container mt-5 bg-light p-1 border border-primary border-1 rounded ">
              <h3 className="text-primary">
                <b> Reports</b>
              </h3>
              <button
                className="btn btn-light  border border-primary border-3 m-1"
                onClick={() => {
                  navigate("/vendor_invoice");
                }}
              >
                <b> Vendor Invoice 📰</b>
              </button>
              <button
                className="btn btn-light  border border-primary border-3 m-1"
                onClick={GetHourlyReport}
              >
                <b> Hourly Report ⌛</b>
              </button>
              <button
                className="btn btn-light  border border-primary border-3 m-1"
                onClick={GetVendorKPIReport}
              >
                <b> KPIs & Units Economics Report 🍽️</b>
              </button>
              <button
                className="btn btn-light border border-primary border-3 m-1"
                onClick={() => {
                  navigate("/cancellation_report");
                }}
              >
                <b> Cancellation ❌</b>
              </button>
              {/* <button className="btn btn-dark border-light border-1 m-1">
        <b> Commission 💵</b>
      </button> */}
              {/* <button className="btn btn-dark border-light border-1 m-1">
        <b> Voucher Usage 🔃</b>
      </button> */}
              <button
                className="btn btn-light border border-primary border-3 m-1"
                onClick={GetNEwCustomersReport}
              >
                <b> Get New Customers 🧑‍🤝‍🧑</b>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default HomePage;
