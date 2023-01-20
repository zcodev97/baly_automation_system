import NavBar from "../components/navBar";
import React, { useState, useEffect } from "react";

function HomePage() {
  const [randomNumber, setRandomNumber] = useState(0);
  const [grossClassName, setGrossClassName] = useState("");

  const containerClassNameGauge =
    "container p-1 text-center border border-light border-2 rounded";

  function updateNumber() {
    let rand = Math.floor(Math.random() * 100);
    setRandomNumber(rand);
    if ((rand > 80) & (rand < 100)) {
      setGrossClassName("container text-light");
    } else if ((rand > 60) & (rand < 80)) {
      setGrossClassName("container text-warning");
    } else if ((rand >= 0) & (rand <= 60)) {
      setGrossClassName("container text-danger");
    }
  }

  useEffect(() => {
    setInterval(() => updateNumber(), 5000);
  }, []);

  return (
    <>
      <NavBar />
      <div className="container-fluid text-white text-center bg-dark p-2">
        <div className="row mt-2 p-2">
          <div className="col-md-3">
            <div className={containerClassNameGauge}>
              <h3>Gross</h3>
              <div className={grossClassName}> {randomNumber}% </div>
            </div>
          </div>

          <div className="col-md-3">
            <div className={containerClassNameGauge}>
              <h3>NET</h3>
              <div className={grossClassName}> {randomNumber}% </div>
            </div>
          </div>

          <div className="col-md-3">
            <div className={containerClassNameGauge}>
              <h3>FF%</h3>
              <div className={grossClassName}> {randomNumber}% </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className={containerClassNameGauge}>
              <h3>AOV</h3>
              <div className={grossClassName}> {randomNumber}% </div>
            </div>
          </div>
        </div>
        {/*  */}
        <div className="row mt-2 p-2">
          <div className="col-md-3">
            <div className={containerClassNameGauge}>
              <h3>Revenue</h3>
              <div className={grossClassName}> {randomNumber}% </div>
            </div>
          </div>

          <div className="col-md-3">
            <div className={containerClassNameGauge}>
              <h3>CPI</h3>
              <div className={grossClassName}> {randomNumber}% </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className={containerClassNameGauge}>
              <h3>Blocked Users</h3>
              <div className={grossClassName}> {randomNumber}% </div>
            </div>
          </div>

          <div className="col-md-3">
            <div className={containerClassNameGauge}>
              <h3>Signups</h3>
              <div className={grossClassName}> {randomNumber}% </div>
            </div>
          </div>
        </div>
        {/*  */}
        <div className="row mt-2 p-2">
          <div className="col-md-6">
            <div className={containerClassNameGauge}>
              <h3>New Users</h3>
              <div className={grossClassName}> {randomNumber}% </div>
            </div>
          </div>
          <div className="col-md-6">
            <div className={containerClassNameGauge}>
              <h3>First Orders</h3>
              <div className={grossClassName}> {randomNumber}% </div>
            </div>
          </div>
        </div>

        <hr className="mt-5" />
        <div className="container mt-5 bg-dark p-1 border-1">
          <h3>Reports</h3>
          <button className="btn btn-dark border-light border-1 m-1">
            <b> Hourly Report ⌛</b>
          </button>
          <button className="btn btn-dark border-light border-1 m-1">
            <b> Vendor KPIs 🍽️</b>
          </button>
          <button className="btn btn-dark border-light border-1 m-1">
            <b> Cancellation ❌</b>
          </button>
          <button className="btn btn-dark border-light border-1 m-1">
            <b> Commission 💵</b>
          </button>
          <button className="btn btn-dark border-light border-1 m-1">
            <b> Voucher Usage 🔃</b>
          </button>
        </div>
      </div>
    </>
  );
}

export default HomePage;
