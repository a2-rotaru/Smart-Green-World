import React from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { CgProfile } from "react-icons/cg";
import axios from "axios";
import { useState } from "react";
import { useHistory } from "react-router";

const Change_Password = () => {
  // UPDATE PASSWORD

  const [passwordUpdate, setPasswordUpdate] = useState("");
  const [password2, setPassword2] = useState("");
  const [error, setError] = useState("");

  const update_password = async (e) => {
    e.preventDefault();
    if (password2 !== passwordUpdate) {
      setError("Passwords do not match");
    } else {
      try {
        await axios.put(
          `/update_password/${localStorage.getItem("username")}`,
          {
            password: passwordUpdate,
          }
        );
        submitChanges();
      } catch (error) {
        console.log(error);
      }
    }
  };

  // REDIRECT TO NOTES PAGE
  const history = useHistory();
  function submitChanges() {
    history.push("/profile");
  }
  return (
    <div>
      <Navbar />
      <div className="profile-container">
        <h1 className="profile-title">{localStorage.getItem("username")}</h1>

        <div className="profile-icon">
          <CgProfile />
          <br></br>
        </div>
        <form onSubmit={update_password}>
          <div className="profile-details">
            {error && <span className="error">{error}</span>}
            <ul>
              <li>
                <label className="label">New Password: </label>
                <input
                  className="input_fields"
                  type="password"
                  onChange={(e) => {
                    setPasswordUpdate(e.target.value);
                  }}
                  required
                />
              </li>

              <li>
                <label className="label">Confirm Password: </label>
                <input
                  className="input_fields"
                  type="password"
                  onChange={(e) => {
                    setPassword2(e.target.value);
                  }}
                  required
                />
              </li>
            </ul>

            <button className="submit-password">Submit</button>
          </div>
        </form>

        <div className="footer">
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default Change_Password;
