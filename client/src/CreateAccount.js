import axios from "axios";
import lettuce from "./images/lettuce.jpg";
import { Link } from "react-router-dom";
import "./CSS/CreateAccount.css";
import { useState, useEffect } from "react";

const CreateAccount = ({ history }) => {
  const [usernameReg, setUsernameReg] = useState("");
  const [passwordReg, setPasswordReg] = useState("");
  const [nameReg, setNameReg] = useState("");
  const [emailReg, setEmailReg] = useState("");
  const [crop_nameReg, setCrop_NameReg] = useState("");
  const [arduinoReg, setArduinoReg] = useState("");
  const [cropsList, setCropsList] = useState("");
  const [message, setMessage] = useState("");

  // Redirect user to home page
  useEffect(() => {
    if (localStorage.getItem("access-token")) {
      history.push("/");
    }
  }, [history]);

  //Get the crops
  useEffect(() => {
    const getCrops = async () => {
      try {
        axios.get("/crops").then((response) => {
          setCropsList(response.data);
        });
      } catch (error) {
        console.log(error);
      }
    };

    getCrops();
  }, []);

  //Register function
  const register = async (e) => {
    e.preventDefault();
    try {
      await axios
        .post("/register", {
          username: usernameReg,
          password: passwordReg,
          name: nameReg,
          email: emailReg,
          crop_name: crop_nameReg,
          arduino_id: arduinoReg,
        })
        .then((response) => {
          localStorage.setItem("authToken", response.data.accessToken);
          localStorage.setItem("username", usernameReg);

          history.push("/");
        });
    } catch (error) {
      console.log(error);
      setMessage(" Wrong Arduino Id!");
      setTimeout(() => {
        setMessage("");
      }, 5000);
    }
  };

  return (
    <div className="container">
      <img src={lettuce} alt="Background image" className="background-image" />
      <form className="account-form" onSubmit={register}>
        <div className="account-header">
          <h1>Welcome to Smart Green World!</h1>
          <h2>Create account </h2>
        </div>
        <div className="account-body">
          {message && <span className="error-message">{message}</span>}

          <label className="usernameLabel">Username</label>
          <input
            className="Username-input"
            type="text"
            onChange={(e) => {
              setUsernameReg(e.target.value);
            }}
            required
          />

          <label className="passwordLabel">Password</label>
          <input
            className="Password-input"
            type="password"
            onChange={(e) => {
              setPasswordReg(e.target.value);
            }}
            required
          />
          <label className="nameLabel">Name</label>
          <input
            className="name-input"
            type="text"
            onChange={(e) => {
              setNameReg(e.target.value);
            }}
            required
          />
          <label className="emailLabel">Email</label>
          <input
            className="email-input"
            type="email"
            onChange={(e) => {
              setEmailReg(e.target.value);
            }}
            required
          />
          <label className="cropLabel">Crop</label>
          <select
            className="crop-input"
            name="crops"
            onChange={(e) => {
              setCrop_NameReg(e.target.value);
            }}
            required
          >
            <option value="none" selected disabled hidden>
              Select the crop
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
          <label className="arduinoLabel">Arduino Id</label>
          <input
            className="arduino-input"
            type="text"
            onChange={(e) => {
              setArduinoReg(e.target.value);
            }}
            required
          />
          <div className="createButton">
            <input type="submit" value="Create account" />
          </div>
          <div className="login-link">
            <Link to="/login">Please click here if you have an account</Link>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreateAccount;
