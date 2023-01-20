import { useState } from "react";
import Select from "react-select";
import supabase from "../../../supabase";
import { useNavigate } from "react-router-dom";
import NavBar from "../../../components/navBar";

function AddUser() {
  const navigate = useNavigate();

  function getDate() {
    return new Date().toLocaleString();
  }

  const [selectedUserType, setSelectedUserType] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const userType = [
    { label: "Admin", value: "1" },
    { label: "Account Manager", value: "2" },
    { label: "CC", value: "3" },
  ];

  function handleEmail(e) {
    setEmail(e.target.value);
  }
  function handlePassword(e) {
    setPassword(e.target.value);
  }

  async function handleAddNewUser() {
    let { data: user, errorEmail } = await supabase
      .from("users")
      .select("*")
      .eq("email", email);

    if (user.length > 0) {
      alert("This User Is Founded and cannot be added");

      return;
    }

    const { data, errorAddingNewUser } = await supabase.from("users").insert([
      {
        email: email.toLocaleLowerCase(),
        password: password,
        user_type: selectedUserType,
        is_active: true,
        created_at: getDate(),
      },
    ]);

    // console.log(data);
    // console.log(errorAddingNewUser);

    if (data === null) {
      alert("new user added " + email);

      navigate("/users");
    }

    if (errorAddingNewUser !== undefined) {
      alert(errorAddingNewUser);
    }
  }

  return (
    <>
      <NavBar />

      <div className="container w-50 bg-dark rounded">
        <div className="container m-2 p-2">
          <p className="text-white">Email</p>
          <input
            type="email"
            className="form-control"
            id="uname"
            placeholder="Email... ex ( test@baly.iq )"
            name="uname"
            required=""
            onChange={handleEmail}
          />
        </div>

        <div className="container m-2 p-2">
          <p className="text-white">Password</p>
          <input
            type="password"
            className="form-control"
            id="uname"
            placeholder="***"
            name="uname"
            required=""
            onChange={handlePassword}
          />
        </div>

        {/* issue type */}
        <div className="container m-1 p-2">
          <p className="text-white">User Type</p>
          <Select
            options={userType}
            onChange={(opt) => setSelectedUserType(opt.value)}
            // isMulti
          />
        </div>

        <button
          className="btn btn-light m-2 border rounded"
          onClick={handleAddNewUser}
        >
          New User ➕
        </button>
      </div>
    </>
  );
}

export default AddUser;
