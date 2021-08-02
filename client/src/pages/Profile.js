import React from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { CgProfile } from "react-icons/cg";
import "./../CSS/Profile.css";
import { useHistory } from "react-router";
import { useEffect, useState } from "react";
import axios from "axios";

const Profile = () => {
  // GET DETAILS
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [crop, setCrop] = useState("");

  useEffect(() => {
    async function getDetails() {
      await axios
        .get(`/details/${localStorage.getItem("username")}`)
        .then((response) => {
          // console.log(response.data.rows[0].email);
          setEmail(response.data.rows[0].email);
          setUsername(response.data.rows[0].username);
          setCrop(response.data.rows[0].crop_name);
        });
    }
    getDetails();
  }, []);

  // REDIRECT TO EDIT PROFILE
  const history = useHistory();
  function editProfile() {
    history.push("/edit-profile");
  }

  function changePassword() {
    history.push("/change-password");
  }
  return (
    <div>
      <Navbar />
      <div className="profile-container">
        <div className="profile-icon">
          <CgProfile />
        </div>
        <h1 className="profile-title">{localStorage.getItem("username")}</h1>

        <div className="profile-details">
          <ul>
            <li>
              <label className="profile-label">Email: {email}</label>
            </li>
            <li>
              <label className="profile-label">Username: {username}</label>
            </li>
            <li>
              <label className="profile-label">Crop name: {crop}</label>
            </li>
          </ul>
          <button className="edit-profile-button" onClick={editProfile}>
            Edit profile
          </button>
          <button className="change-password" onClick={changePassword}>
            Change password
          </button>
        </div>

        <div className="footer">
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default Profile;
