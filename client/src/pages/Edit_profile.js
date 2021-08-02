import React from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import axios from "axios";
import { useEffect, useState } from "react";
import { CgProfile } from "react-icons/cg";
import { useHistory } from "react-router";

const Edit_profile = () => {
  // GET DETAILS
  const [email, setEmail] = useState("");
  const [crop, setCrop] = useState("");

  useEffect(() => {
    async function getDetails() {
      await axios
        .get(`/details/${localStorage.getItem("username")}`)
        .then((response) => {
          console.log(response.data.rows[0].email);
          setEmail(response.data.rows[0].email);
          setCrop(response.data.rows[0].crop_name);
        });
    }
    getDetails();
  }, []);

  //Get the crops
  const [cropsList, setCropsList] = useState("");

  useEffect(() => {
    axios.get("/crops").then((response) => {
      setCropsList(response.data);
    });
  }, []);

  // UPDATE FUNCTION
  const [emailUpdate, setEmailUpdate] = useState("");
  const [crop_nameUpdate, setCropUpdate] = useState("");

  const update = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/update_details/${localStorage.getItem("username")}`, {
        email: emailUpdate ? emailUpdate : email,
        crop_name: crop_nameUpdate ? crop_nameUpdate : crop,
      });
      submitChanges();
    } catch (error) {
      console.log(error);
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
        </div>
        <form onSubmit={update}>
          <div className="profile-details">
            <ul>
              <li>
                <label className="label">Email: </label>
                <input
                  className="input_fields"
                  type="text"
                  defaultValue={email}
                  onChange={(e) => {
                    setEmailUpdate(e.target.value);
                  }}
                />
              </li>
              <li>
                <label className="label">Crop name:</label>
                <select
                  className="input_fields"
                  name="crops"
                  onChange={(e) => {
                    setCropUpdate(e.target.value);
                  }}
                  required
                >
                  <option value="none" selected disabled hidden>
                    {crop}
                  </option>
                  {cropsList &&
                    cropsList.map((crop, index) => {
                      return (
                        <option key={index} value={crop.crop_name}>
                          {crop.crop_name}
                        </option>
                      );
                    })}
                </select>
              </li>
            </ul>

            <button className="submit-changes">Submit Changes</button>
          </div>
        </form>

        <div className="footer">
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default Edit_profile;
