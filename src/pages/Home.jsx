import { useNavigate } from "react-router-dom";
import NavBar from "../components/navBar";
import React, { useState, useEffect } from "react";
import Loading from "../components/loading";
import BACKEND_URL from "../global";

function HomePage() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [grossClassName, setGrossClassName] = useState("");

  const containerClassNameGauge =
    "container p-1 text-center border border-primary border-2 rounded";

  const [net, setNet] = useState(0);
  const [gross, setGross] = useState(0);
  const [cancel, setCancel] = useState(0);
  const [nmv, setNVM] = useState(0);
  const [df, setDF] = useState(0);
  const [signup, setSignUp] = useState(0);
  const [newUser, setNewUser] = useState(0);
  const [blockedUser, setBlockedUser] = useState(0);

  function GetNEwCustomersReport() {
    navigate("/get_new_customers_report");
  }
  function GetHourlyReport() {
    navigate("/get_hourly_report");
  }
  function GetVendorKPIReport() {
    navigate("/get_vendor_kpi_report");
  }

  function getAllVendorsForCurrentAccountManager() {
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
        setNet(data[0].net);
        setGross(data[0].gross);
        setCancel(data[0].cancel);
        setBlockedUser(data[0].blocked_user);
        setNewUser(data[0].new_user);
        setNVM(data[0].NMV);
        setDF(data[0].DF);
        setSignUp(data[0].signups);
        setLoading(false);
      })
      .catch((error) => {
        // alert(error);
        console.log(error);
        setLoading(false);
      });
  }

  useEffect(() => {
    getAllVendorsForCurrentAccountManager();
    setInterval(() => getAllVendorsForCurrentAccountManager(), 10000);
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <>
      <NavBar />
      <div className="container-fluid text-light text-center bg-dark p-2 rounded mt-4">
        <div className="container text-center text-light">
          <h4>
            <b> Dashboard</b>
          </h4>
        </div>
        <div className="row mt-2 p-2">
          <div className="col-md-3">
            <div className={containerClassNameGauge}>
              <h3>Gross</h3>
              <div className={grossClassName}> {gross} </div>
            </div>
          </div>

          <div className="col-md-3">
            <div className={containerClassNameGauge}>
              <h3>NET</h3>
              <div className={grossClassName}> {net} </div>
            </div>
          </div>

          <div className="col-md-3">
            <div className={containerClassNameGauge}>
              <h3>DF</h3>
              <div className={grossClassName}>
                {" "}
                {Math.round(df).toLocaleString() + " $"}{" "}
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className={containerClassNameGauge}>
              <h3>NMV</h3>
              <div className={grossClassName}>
                {" "}
                {Math.round(nmv).toLocaleString() + " $"}{" "}
              </div>
            </div>
          </div>
        </div>
        {/*  */}
        <div className="row mt-2 p-2">
          <div className="col-md-3">
            <div className={containerClassNameGauge}>
              <h3>Sign Ups</h3>
              <div className={grossClassName}> {signup} </div>
            </div>
          </div>

          <div className="col-md-3">
            <div className={containerClassNameGauge}>
              <h3>newUser</h3>
              <div className={grossClassName}> {newUser} </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className={containerClassNameGauge}>
              <h3>Blocked Users</h3>
              <div className={grossClassName}> {blockedUser} </div>
            </div>
          </div>

          <div className="col-md-3">
            <div className={containerClassNameGauge}>
              <h3>Cancel</h3>
              <div className={grossClassName}> {cancel} </div>
            </div>
          </div>
        </div>
        {/*  */}

        <hr className="mt-5" />
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
    </>
  );
}

export default HomePage;
