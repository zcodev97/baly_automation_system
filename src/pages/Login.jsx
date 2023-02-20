import { useState, React, useEffect } from "react";
import Loading from "../components/loading";
import { useNavigate } from "react-router-dom";
import BACKEND_URL from "../global";

function Login() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  async function checkIfUsernameAndPasswordIsCorrect() {
    setLoading(true);
    await fetch(BACKEND_URL + "auth/signin", {
      method: "POST",
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: username,
        password: password,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        // console.log(data);
        console.log(data.token.access_token);
        localStorage.setItem("token", data.token.access_token);
        localStorage.setItem("email", data.account.email);
        localStorage.setItem("username", data.account.username);
        navigate("/home", { replace: true });
      })
      .catch((error) => {
        alert(error);
      });
    setLoading(false);
  }

  const handleUsername = (event) => {
    setUsername(event.target.value);
  };

  const handlePassword = (event) => {
    setPassword(event.target.value);
  };

  if (loading) return <Loading />;

  return (
    <>
      <form>
        <div className="container-fluid bg-primary text-white p-2 mb-5 text-center">
          <h2>
            <b>BALY</b>
          </h2>
        </div>
        <div className="container w-50 text-center p-4 text-primary">
          <h2>
            <b>Welcome To Baly Ticketing System </b>{" "}
          </h2>
        </div>
        <div
          className="container p-4  w-25 border rounded  text-center bg-primary text-white"
          style={{ height: "50vh" }}
        >
          <h2 className="text-center pt-5">Login Page</h2>

          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              type="text"
              className="form-control"
              id="email"
              placeholder="Enter email"
              name="email"
              onChange={handleUsername}
            />
          </div>
          <div className="form-group">
            <label htmlFor="pwd">Password:</label>
            <input
              type="password"
              className="form-control"
              id="pwd"
              placeholder="Enter password"
              name="pswd"
              onChange={handlePassword}
            />
          </div>
          <button
            className="btn btn-dark rounded-pill text-white mt-2 text-center"
            onClick={async () => {
              await checkIfUsernameAndPasswordIsCorrect();
            }}
            onKeyDown={async () => {
              await checkIfUsernameAndPasswordIsCorrect();
            }}
          >
            Sign In
          </button>
        </div>
      </form>
    </>
  );
}

export default Login;
