import logo from "../components/baly_image.png";
import { useState, React, useEffect } from "react";
import { Outlet, Link } from "react-router-dom";
import supabase from "../supabase";
import ShowErrorMessage from "../components/ShowErrorMessage";
import Loading from "../components/loading";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  const [checked, setChecked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  var loginPage;

  const [users, setUsers] = useState([]);

  async function checkIfUsernameAndPasswordIsCorrect() {
    let { data: users, error } = await supabase
      .from("users")
      .select("*")
      .eq("email", username)
      .eq("password", password);
    // console.log(error);

    if (users.length === 0) {
      alert("Error username or password");
      return;
    }

    setUsers(users);
    return users[0].user_type;
  }

  // useEffect(() => {
  //   getAllUsers();
  // }, []);

  async function onClickLoginBtn() {
    setLoading(true);

    let user_type = await checkIfUsernameAndPasswordIsCorrect();

    if (username.length < 6) {
      alert("Username must be more than 8 Characters");
    }

    if (password.length < 6) {
      alert("Password must be more than 8 Characters");
    }

    localStorage.setItem("username", JSON.stringify(username));
    localStorage.setItem("password", JSON.stringify(password));
    localStorage.setItem("user_type", user_type);
    // localStorage.setItem("checked", JSON.stringify(checked));

    navigate("/tickets", { replace: true });

    setLoading(false);
  }

  // const handleRememberMe = (event) => {
  //   setChecked(event.target.checked);
  // };

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
          {" "}
          <h2>
            <b>BALY</b>{" "}
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
              type="email"
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
          {/* <div className="form-group form-check">
          <label className="form-check-label">
            <input
              className="form-check-input"
              type="checkbox"
              name="remember"
              checked={null}
              onChange={handleRememberMe}
            />{" "}
            Remember me
          </label>
        </div> */}
          <button
            className="btn btn-dark rounded-pill text-white mt-2 text-center"
            onClick={onClickLoginBtn}
            onKeyDown={onClickLoginBtn}
          >
            Sign In
          </button>
        </div>
      </form>
    </>
  );
}

export default Login;
